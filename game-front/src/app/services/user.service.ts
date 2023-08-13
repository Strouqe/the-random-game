import { EventEmitter, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  NEVER,
  Observable,
  Subject,
  Subscription,
  distinctUntilChanged,
  mapTo,
  merge,
  shareReplay,
  tap,
  timer,
  withLatestFrom,
} from 'rxjs';
import { map, scan, startWith, switchMap } from 'rxjs/operators';
import { Character } from '../models/character.model';
import { User } from '../models/user.model';
import { WebsocketService } from './websocket.service';

const sampleUser: User = {
  name: 'John Doe',
  currencyBalance: 0,
  currencyIncome: 0,
  characters: [],
  missionsCompleated: [],
  timePlayed: 0,
};

export interface CounterStateModel {
  count: number;
  isTicking: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userChanged: Subject<User>;
  incomeChanged: Subject<number>;
  timePlayedChanged: Subject<number>;
  userIncomeSubscription: Subscription;
  incomeGeneratorSubscription: Subscription;

  initialCounterState: CounterStateModel;
  patchCounterState: BehaviorSubject<Partial<CounterStateModel>>;
  counterCommands$: any; //???;
  commandFromTick$: Observable<Partial<CounterStateModel>>;
  commandFromReset$: Observable<Partial<CounterStateModel>>;
  counterState$: Observable<CounterStateModel>;
  isTicking$: any; //Observable<boolean>???;

  trigerStartEvent: EventEmitter<void> = new EventEmitter();
  trigerPauseEvent: EventEmitter<void> = new EventEmitter();
  trigerUpdateCountStateEvent: EventEmitter<void> = new EventEmitter();
  triggerUpdateIncomeEvent: EventEmitter<void> = new EventEmitter();

  private user: User;

  constructor(private wsService: WebsocketService) {
    this.userChanged = new Subject<User>();
  }

  setUser(userName: string) {
    this.user = sampleUser;
    this.user.name = userName;
    this.userChanged.next(this.user);
  }

  getUser() {
    return this.user;
  }

  getCharacters(): Character[] {
    return this.user.characters;
  }

  addcharacter(cherecter: Character): void {
    this.user.currencyBalance -= cherecter.price;
    this.user.characters.push(cherecter);
    this.user.currencyIncome = this.getUserIncome();
    this.userChanged.next(this.user);
    this.trigerUpdateState();
  }

  deleteCharacter(cherecter: Character): void {
    this.user.currencyBalance -= cherecter.price;
    this.user.characters = this.user.characters.filter(
      (character) => character !== cherecter
    );
    this.user.currencyIncome = this.getUserIncome();
    this.userChanged.next(this.user);
    this.trigerUpdateState();
  }

  updateIncome(): void {
    this.user.currencyIncome = this.getUserIncome();
    this.userChanged.next(this.user);
  }

  initService(): void {
    this.userChanged.subscribe((user: User) => {
      this.user = user;
    });

    this.initialCounterState = {
      count: 1000,
      isTicking: false,
    };

    this.patchCounterState = new BehaviorSubject<Partial<CounterStateModel>>(
      this.isTicking$
    );

    this.counterCommands$ = merge(
      this.trigerStartEvent.pipe(mapTo({ isTicking: true })),
      this.trigerPauseEvent.pipe(mapTo({ isTicking: false })),
      this.trigerUpdateCountStateEvent.pipe(
        mapTo({
          count: this.user.currencyBalance,
        })
      ),
      this.patchCounterState.asObservable()
    );

    this.counterState$ = this.counterCommands$.pipe(
      startWith(this.initialCounterState),
      scan(
        (counterState: CounterStateModel, command): CounterStateModel => ({
          ...counterState,
          ...command,
        })
      ),
      shareReplay(1)
    );

    this.isTicking$ = this.counterState$.pipe(
      map((state) => state.isTicking),
      distinctUntilChanged()
    );

    this.commandFromTick$ = this.isTicking$.pipe(
      switchMap((isTicking) => (isTicking ? timer(0, 15000) : NEVER)),
      withLatestFrom(this.counterState$, (_, counterState) => ({
        count: this.user.currencyBalance + this.user.currencyIncome / 4,
      })),
      tap(({ count }) => {
        this.wsService.sendToServer({
          type: 'update',
          data: JSON.stringify(this.getUser()),
        });
        this.wsService.sendToServer({ type: 'data request' });
        this.patchCounterState.next({
          count: count + this.user.currencyIncome / 4,
        });
      })
    );

    this.incomeGeneratorSubscription = this.commandFromTick$
      .pipe(startWith(this.initialCounterState))
      .subscribe((state) => {
        if (state.count) {
          this.user.currencyBalance = state.count;
          this.userChanged.next(this.user);
        }
      });

    setInterval(() => {
      this.user.timePlayed += 15;
      this.userChanged.next(this.user);
    }, 15000);
  }

  trigerPause(): void {
    this.trigerPauseEvent.emit();
  }

  trigerStart(): void {
    this.trigerStartEvent.emit();
  }
  trigerUpdateState(): void {
    this.trigerUpdateCountStateEvent.emit();
  }

  private getUserIncome(): number {
    return this.user.characters.reduce((acc, character) => {
      return acc + character.income;
    }, 0);
  }
}
