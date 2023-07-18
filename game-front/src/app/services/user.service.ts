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
import { Charecter } from '../models/charecter.model';

const sampleUser: User = {
  name: 'John Doe',
  currencyBalance: 101,
  currencyIncome: 40, // should remove and calculate from charecters
  charecters: [
    {
      id: 1,
      name: 'Morty',
      price: 100,
      income: 11,
      image: 'https://res.cloudinary.com/demo/image/twitter/1330457336.jpg',
      fatigue: 0,
      characteristics: {
        intelect: 25,
        strength: 25,
        dexterity: 25,
      },
    },
    {
      id: 2,
      name: 'Doc',
      price: 100,
      income: 12,
      image: 'https://res.cloudinary.com/demo/image/twitter/1330457336.jpg',
      fatigue: 0,
      characteristics: {
        intelect: 25,
        strength: 25,
        dexterity: 25,
      },
    },
  ],
  missionsCompleated: [
    {
      id: 1,
      name: 'Dungeon Exploration',
      dificulty: 100,
      reward: 100,
      requirements: {
        intelect: 15,
        strength: 15,
        dexterity: 15,
      },
    },
  ],
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
  userIncomeSubscription: Subscription;
  incomeGeneratorSubscription: Subscription;

  initialCounterState: CounterStateModel;
  patchCounterState:  BehaviorSubject<Partial<CounterStateModel>>;
  counterCommands$: any;
  commandFromTick$: Observable<Partial<CounterStateModel>>;
  commandFromReset$: Observable<Partial<CounterStateModel>>;
  counterState$: Observable<CounterStateModel>;
  isTicking$: any;

  trigerStartEvent: EventEmitter<void> = new EventEmitter();
  trigerPauseEvent: EventEmitter<void> = new EventEmitter();
  // stopBtn = document.querySelector('#stopBtn') as HTMLButtonElement;
  // pauseBtn = document.querySelector('#pauseBtn') as HTMLButtonElement;

  // startClick$ = fromEvent(this.trigerStart, 'click');
  // stopClick$ = fromEvent(this.stopBtn, 'click');
  // pauseBtn$ = fromEvent(this.pauseBtn, 'click');

  private user: User;

  constructor() {
    // this.fetchUser();
    this.userChanged = new Subject<User>();

    this.initialCounterState = {
      count: sampleUser.currencyBalance,
      isTicking: true,
    };

    this.patchCounterState = new BehaviorSubject<Partial<CounterStateModel>>(this.isTicking$);

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
      switchMap((isTicking) => (isTicking ? timer(0, 15000) : NEVER)),
      withLatestFrom(this.counterState$, (_, counterState) => ({
        count: counterState.count,
      })),
      tap(({ count }) => {
        console.log('count', count);

        this.patchCounterState.next({ count: count + this.user.currencyIncome });

      })
    );

    // this.commandFromReset$ = this.stopClick$.pipe(mapTo({ ...this.initialCounterState }));

    this.incomeGeneratorSubscription =
      this.commandFromTick$.pipe(startWith(this.initialCounterState))
      .subscribe((state) => {
        console.log('state', state);
        if(state.count) {

          this.user.currencyBalance = state.count;
        }
        this.userChanged.next(this.user);
      });
  }

  trigerPause(): void {
    this.trigerPauseEvent.emit();
  }

  trigerStart(): void {
    this.trigerStartEvent.emit();
  }

  fetchUser(): void {
    this.user = sampleUser;
    this.user.currencyIncome = this.getUserIncome();
    this.userChanged.next(this.user);
  }
  addCharecter(cherecter: Charecter): void {
    this.user.currencyBalance -= cherecter.price;
    this.user.charecters.push(cherecter);
    this.user.currencyIncome = this.getUserIncome();
    this.userChanged.next(this.user);
  }

  private getUserIncome(): number {
    return this.user.charecters.reduce((acc, charecter) => {
      return acc + charecter.income;
    }, 0);
  }
}
