import { EventEmitter, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  NEVER,
  Observable,
  Subject,
  Subscription,
  distinctUntilChanged,
  fromEvent,
  mapTo,
  merge,
  of,
  shareReplay,
  tap,
  timer,
  withLatestFrom,
} from 'rxjs';
import { map, scan, startWith, switchMap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Character } from '../models/character.model';
import { WebsocketService } from './websocket.service';

const sampleUser: User = {
  name: 'John Doe',
  currencyBalance: 0,
  currencyIncome: 0, // should remove and calculate from characters
  characters: [],
  missionsCompleated: [],
  timePlayed: 0,
};

export interface CounterStateModel {
  count: number;
  isTicking: boolean;
  // income: number;
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
  counterCommands$: any;
  commandFromTick$: Observable<Partial<CounterStateModel>>;
  commandFromReset$: Observable<Partial<CounterStateModel>>;
  counterState$: Observable<CounterStateModel>;
  isTicking$: any;

  trigerStartEvent: EventEmitter<void> = new EventEmitter();
  trigerPauseEvent: EventEmitter<void> = new EventEmitter();
  trigerUpdateCountStateEvent: EventEmitter<void> = new EventEmitter();
  triggerUpdateIncomeEvent: EventEmitter<void> = new EventEmitter();

  private user: User;

  constructor(private wsService: WebsocketService) {
    this.userChanged = new Subject<User>();
  }

  initService(): void {
    this.userChanged.subscribe((user: User) => {
      this.user = user;
      console.log('Balance of the User in user component ====>', this.user);
    });

    this.initialCounterState = {
      count: 400,
      isTicking: false,
      // income: 0,
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
          // income: this.user.currencyIncome,
        })
      ),
      // this.triggerUpdateIncomeEvent.pipe(mapTo({income: this.getUserIncome()})),
      // this.stopClick$.pipe(mapTo({ ...this.initialCounterState })),
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
      switchMap((isTicking) => (isTicking ? timer(100, 15000) : NEVER)),
      withLatestFrom(this.counterState$, (_, counterState) => ({
        count: this.user.currencyBalance + (this.user.currencyIncome / 4),
        // income: counterState.income,
      })),
      tap(({ count }) => {
        console.log('count', count);
        // console.log('income', income);
        this.wsService.sendToServer({
          type: 'logout',
          data: this.getUser()
        });
        this.wsService.sendToServer({
          type: 'login',
          data: this.getUser()
        });
        this.wsService.sendToServer({ type: 'data request' });

        this.patchCounterState.next({
          count: count + this.user.currencyIncome / 4,
          // income: this.getUserIncome() / 4,
        });
      })
    );

    this.incomeGeneratorSubscription = this.commandFromTick$
      .pipe(startWith(this.initialCounterState))
      .subscribe((state) => {
        console.log('state', state);
        if (state.count) {
          this.user.currencyBalance = state.count;
          // this.trigerUpdateState();
          this.userChanged.next(this.user);
          console.log('user balance in income generation sub =====>', this.getUser().currencyBalance);
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

  fetchUser(): void {
    // this.user = sampleUser;
    this.user.currencyIncome = this.getUserIncome();
    this.userChanged.next(this.user);
  }

  getUser(): User {
    return this.user;
  }

  setUser(userName: string): void {
    this.user = sampleUser;
    this.user.name = userName;

    // this.user.currencyIncome = this.getUserIncome();
    // this.trigerUpdateCountStateEvent.emit();
    this.userChanged.next(this.user);
  }
  addcharacter(cherecter: Character): void {
    this.user.currencyBalance -= cherecter.price;
    this.user.characters.push(cherecter);
    this.user.currencyIncome = this.getUserIncome();
    this.userChanged.next(this.user);
    this.trigerUpdateState();
    // this.trigerUpdateCountStateEvent.emit();
  }

  deleteCharacter(cherecter: Character): void {
    this.user.currencyBalance -= cherecter.price;
    this.user.characters = this.user.characters.filter(
      (character) => character !== cherecter
    );
    this.user.currencyIncome = this.getUserIncome();
    this.userChanged.next(this.user);
    // this.trigerUpdateState();
    this.trigerUpdateCountStateEvent.emit();
  }

  getCharacters(): Character[] {
    return this.user.characters;
  }
  updateIncome(): void {
    this.user.currencyIncome = this.getUserIncome();
    this.userChanged.next(this.user);
    // this.trigerUpdateState();
  }

  private getUserIncome(): number {
    return this.user.characters.reduce((acc, character) => {
      return acc + character.income;
    }, 0);
  }
}
