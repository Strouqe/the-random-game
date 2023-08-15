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

  startMission(mission: Mission, party: Character[]): boolean {
    const req = mission.requirements;
    for (const character in party) {
      if (
        party[character].characteristics.strength < req.strength &&
        party[character].characteristics.dexterity < req.dexterity &&
        party[character].characteristics.intelect < req.intelect
      ) {
        this.user.characters = [...this.user.characters];
        this.userService.userChanged.next(this.user);
        this.userService.updateIncome();
        let message = {
          type: 'mission result',
          data: {
            name: this.user.name,
            currencyBalance: this.user.currencyBalance,
            mission: mission.name,
            difficulty: mission.difficulty,
            result: "Defeat",
          },
        };
        this.wsService.sendToServer(message);
        return false;
      }
    }
    this.user.characters = [...this.user.characters, ...party];
    this.user.missionsCompleated.push(mission);
    this.user.currencyBalance += mission.reward;
    this.userService.userChanged.next(this.user);
    this.userService.trigerUpdateState();
    let message = {
      type: 'mission result',
      data: {
        name: this.user.name,
        currencyBalance: this.user.currencyBalance,
        mission: mission.name,
        difficulty: mission.difficulty,
        result: "Victory",
      },
    };
    this.wsService.sendToServer(message);
    return true;
  }
}
