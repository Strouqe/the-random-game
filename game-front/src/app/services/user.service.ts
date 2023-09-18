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
import { EncryptStorage } from 'encrypt-storage';
import { environment } from '../environments/environment';

const sampleUser: User = {
  name: '',
  currencyBalance: 0,
  currencyIncome: 0,
  characters: [],
  missionsCompleated: [],
  timePlayed: 0,
  points: 0,
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

  pause: boolean;
  timePlayed: any; //NodeJS.Timeout; install node types
  encryptStorage: EncryptStorage

  private user: User;

  constructor(private wsService: WebsocketService) {
    this.encryptStorage = new EncryptStorage(environment.SECRET,{
      storageType: 'sessionStorage',
    });
    this.userChanged = new Subject<User>();
    this.pause = false;
  }

  setUserStorage(): void {
    if(this.encryptStorage.getItem('user')){
      this.encryptStorage.removeItem('user')

      this.encryptStorage.setItem('user', JSON.stringify(this.user));
    } else {
      this.encryptStorage.setItem('user', JSON.stringify(this.user));
    }
  }
  setUserFromMemory(): void {
    let user = this.encryptStorage.getItem('user');
    this.user = user;
    this.userChanged.next(this.user);
    this.trigerUpdateState();
  }

  getUserFromMemory(): User {
    let user = this.encryptStorage.getItem('user');
    return user;
  }

  setUser(userName: string): void {
    this.user = new User("",0,0,[],[],0,0);
    this.user.name = userName;
    this.userChanged.next(this.user);
  }

  getUser(): User {
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
    this.setUserStorage();
    this.trigerUpdateState();
  }

  deleteCharacter(cherecter: Character): void {
    this.user.currencyBalance -= cherecter.price;
    this.user.characters = this.user.characters.filter(
      (character) => character !== cherecter
    );
    this.user.currencyIncome = this.getUserIncome();
    this.userChanged.next(this.user);
    this.setUserStorage();
    this.trigerUpdateState();
  }

  updateIncome(): void {
    this.user.currencyIncome = this.getUserIncome();
    this.userChanged.next(this.user);
    this.setUserStorage();
  }
  getCount(): number {
    if(this.encryptStorage.getItem('user')){
      return this.encryptStorage.getItem('user').currencyBalance - (this.encryptStorage.getItem('user').currencyIncome / 4)
    } else {
      return 1000;
    }
  }

  initService(): void {
    if(this.encryptStorage.getItem('user')){
      this.setUserFromMemory()
    }
    this.userChanged.subscribe((user: User) => {
      this.user = user;
    });

    this.initialCounterState = {
      count: this.getCount(),
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
      !this.pause && withLatestFrom(this.counterState$, (_, counterState) => ({
        count: this.user.currencyBalance +  this.ifPause(this.user.currencyIncome / 4),
      })),
      tap(({ count }) => {
        if(this.pause){
          this.pause = false
        } else {
          this.wsService.sendToServer({
            type: 'update',
            data: JSON.stringify(this.getUser()),
          });
          this.wsService.sendToServer({ type: 'data request' });
          this.patchCounterState.next({ count: count + this.user.currencyIncome / 4,});
          this.setUserStorage();
        }
      })
    );




    this.incomeGeneratorSubscription = this.commandFromTick$
      .pipe(startWith(this.initialCounterState))
      .subscribe((state) => {
        if (state.count) {
          this.user.currencyBalance = state.count;
          this.userChanged.next(this.user);
          this.setUserStorage();
        }
      });

      this.setTimePlayedInterval();
  }
  setTimePlayedInterval(): void {
    this.timePlayed = setInterval(() => {
      this.user.timePlayed += 15;
      this.userChanged.next(this.user);
      this.setUserStorage();
    }, 15000);
  }
  clearTimePlayedInterval(): void {
    clearInterval(this.timePlayed);
  }

  trigerPause(): void {
    this.pause = true;
    this.trigerPauseEvent.emit();
  }

  trigerStart(): void {
    this.trigerStartEvent.emit();
  }
  trigerUpdateState(): void {
    this.trigerUpdateCountStateEvent.emit();
  }

  clearUser(): void {
    this.trigerPauseEvent.emit();
    this.pause = false;
    this.setUser("")
    // this.user = sampleUser;
    // this.userChanged.next(this.user);
    this.trigerUpdateState();

  }

  private getUserIncome(): number {
    return this.user.characters.reduce((acc, character) => {
      return acc + character.income;
    }, 0);
  }
  private ifPause(data:any): any{
      if(!this.pause){
        return data
      }
  }
}
