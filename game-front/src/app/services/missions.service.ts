import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { Character } from '../models/character.model';
import { Mission } from '../models/mission.model';
import { User } from '../models/user.model';
import { UserService } from './user.service';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root',
})
export class MissionsService {
  userSubscription: Subscription;
  promiseResolve: any;
  promiseReject: any;

  private user: User;

  constructor(
    private userService: UserService,
    private wsService: WebsocketService
  ) {
    this.userSubscription = this.userService.userChanged.subscribe(
      (user: User) => {
        this.user = user;
      }
    );
  }

  async getResult(mission: Mission, party: Character[]): Promise<boolean> {
    let message = {
      type: 'mission result',
      data: {
        name: this.user.name,
        currencyBalance: this.user.currencyBalance,
        party: party,
        mission: mission.name,
        difficulty: mission.difficulty,
        result: 'Defeat',
      },
    };
    this.wsService.sendToServer(message);
    let result = await new Promise((resolve, reject) => {
      this.promiseResolve = resolve;
      this.promiseReject = reject;
    }).then((result) => {
      if (result == 'Victory') {
        party.forEach((character) => {
          character.characteristics.strength -= 2;
          character.characteristics.dexterity -= 2;
          character.characteristics.intelect -= 2;
        });
        this.user.characters = [...this.user.characters, ...party];
        this.user.missionsCompleated.push(mission);
        this.user.currencyBalance += mission.reward;
        this.userService.userChanged.next(this.user);
        this.userService.trigerUpdateState();
        return true;
      } else {
        this.user.characters = [...this.user.characters];
        this.userService.userChanged.next(this.user);
        this.userService.updateIncome();
        return false;
      }
    });
    return result;
  }
}
