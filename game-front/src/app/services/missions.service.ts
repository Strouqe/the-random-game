import { Injectable } from '@angular/core';
import { Character, Characteristics } from '../models/character.model';
import { UserService } from './user.service';
import { User } from '../models/user.model';
import { Subscription } from 'rxjs';
import { Mission } from '../models/mission.model';
import { ServerDataService } from './server-data.service';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root',
})
export class MissionsService {
  userSubscription: Subscription;
  private user: User

  constructor(
    private userService: UserService,
    private wsService: WebsocketService
    ) {

    this.userSubscription = this.userService.userChanged.subscribe(
      (user: User) => {
        this.user = user;
        console.log("User in user component ====>", this.user);
      }
    );
  }

  startMission(mission: Mission, party: Character[], charectersLeft: Character[]): boolean {
    const req = mission.requirements;
    console.log('req', req);
    for(const character in party){
      if(party[character].characteristics.strength < req.strength && party[character].characteristics.dexterity < req.dexterity && party[character].characteristics.intelect < req.intelect){
        this.user.characters = [...this.user.characters]
        this.userService.userChanged.next(this.user);
        let message = {
          type: 'mission result',
          data:  this.user
        }
        this.wsService.sendToServer(message);
        return false;
      }
    }
    this.user.characters = [...this.user.characters, ...party]
    this.user.currencyBalance += mission.reward;
    this.userService.userChanged.next(this.user);
    let message = {
      type: 'mission result',
      data:  this.user
    }
    this.wsService.sendToServer(message);
    return true;
  }

  getRandomStats(rangeStart: number, rangeEnd: number): number {
    return Math.floor(Math.random() * (rangeEnd - rangeStart + 1)) + rangeStart;
  }

  getReq(dificulty: number): Characteristics {
    switch (dificulty) {
      case 100:
        return {
          strength: this.getRandomStats(10, 25),
          dexterity: this.getRandomStats(10, 25),
          intelect: this.getRandomStats(10, 25),
        };
      case 200:
        return {
          strength: this.getRandomStats(10, 40),
          dexterity: this.getRandomStats(10, 40),
          intelect: this.getRandomStats(10, 40),
        };
      case 300:
        return {
          strength: this.getRandomStats(10, 60),
          dexterity: this.getRandomStats(10, 60),
          intelect: this.getRandomStats(10, 60),
        };
    }
    return { strength: 100, dexterity: 100, intelect: 100 };
  }
}
