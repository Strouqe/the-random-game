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
  currencyIncome: 40, // should remove and calculate from characters
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
  counterCommands$: any;
  commandFromTick$: Observable<Partial<CounterStateModel>>;
  commandFromReset$: Observable<Partial<CounterStateModel>>;
  counterState$: Observable<CounterStateModel>;
  isTicking$: any;

  trigerStartEvent: EventEmitter<void> = new EventEmitter();
  trigerPauseEvent: EventEmitter<void> = new EventEmitter();

  private user: User;

  constructor(private wsService: WebsocketService) {
    this.userChanged = new Subject<User>();
  }

  initService(): void {

    this.initialCounterState = {
      count: 0,
      isTicking: false,
    };

    this.patchCounterState = new BehaviorSubject<Partial<CounterStateModel>>(
      this.isTicking$
    );

    this.counterCommands$ = merge(
      this.trigerStartEvent.pipe(mapTo({ isTicking: true })),
      this.trigerPauseEvent.pipe(mapTo({ isTicking: false })),
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
      switchMap((isTicking) => (isTicking ? timer(0, 60000) : NEVER)),
      withLatestFrom(this.counterState$, (_, counterState) => ({
        count: counterState.count,
      })),
      tap(({ count }) => {
        console.log('count', count);
        this.wsService.sendToServer({ type: 'data request'})
        this.patchCounterState.next({
          count: count + this.user.currencyIncome,
        });
      })
    );

    this.incomeGeneratorSubscription = this.commandFromTick$
      .pipe(startWith(this.initialCounterState))
      .subscribe((state) => {
        console.log('state', state);
        if (state.count) {
          this.user.currencyBalance = state.count;
        }
        this.userChanged.next(this.user);
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

    this.user.currencyIncome = this.getUserIncome();
    this.userChanged.next(this.user);
  }
  addcharacter(cherecter: Character): void {
    this.user.currencyBalance -= cherecter.price;
    this.user.characters.push(cherecter);
    this.user.currencyIncome = this.getUserIncome();
    this.userChanged.next(this.user);
  }

  deleteCharacter(cherecter: Character): void {
    this.user.currencyBalance -= cherecter.price;
    this.user.characters = this.user.characters.filter(
      (character) => character !== cherecter
    );
    this.user.currencyIncome = this.getUserIncome();
    this.userChanged.next(this.user);
  }

  getCharacters(): Character[] {
    return this.user.characters;
  }

  private getUserIncome(): number {
    return this.user.characters.reduce((acc, character) => {
      return acc + character.income;
    }, 0);
  }
}
