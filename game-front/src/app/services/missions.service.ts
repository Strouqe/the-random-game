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
  getResultResolve: any;
  getResultReject: any;


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

//   async promise() {
//     await new Promise((resolve, reject) => {
//     this.promiseResolve = resolve;
//     this.promiseReject = reject;
//   }).then((result) => {
//     console.log("promise result",result);

//     return result;
//   });

// }

  async getResult(mission: Mission, party: Character[]){
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
      console.log("promise result",result);
      let missionResult = result === 'Victory' ? true : false;
      console.log("missionResult",result == 'Victory' ? true : false)

      // return missionResult;
      if(result == 'Victory'){
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

  // startMission(mission: Mission, party: Character[]): boolean {
  //   const req = mission.requirements;
  //   console.log("async function test",this.getResult(mission, party));
  //   for (const character in party) {
  //     if (
  //       party[character].characteristics.strength < req.strength &&
  //       party[character].characteristics.dexterity < req.dexterity &&
  //       party[character].characteristics.intelect < req.intelect
  //     ) {
  //       this.user.characters = [...this.user.characters];
  //       this.userService.userChanged.next(this.user);
  //       this.userService.updateIncome();
  //       let message = {
  //         type: 'mission result',
  //         data: {
  //           name: this.user.name,
  //           currencyBalance: this.user.currencyBalance,
  //           party: party,
  //           mission: mission.name,
  //           difficulty: mission.difficulty,
  //           result: 'Defeat',
  //         },
  //       };
  //       this.wsService.sendToServer(message);
  //       return false;
  //     }
  //   }
  //   this.user.characters = [...this.user.characters, ...party];
  //   this.user.missionsCompleated.push(mission);
  //   this.user.currencyBalance += mission.reward;
  //   this.userService.userChanged.next(this.user);
  //   this.userService.trigerUpdateState();
  //   let message = {
  //     type: 'mission result',
  //     data: {
  //       name: this.user.name,
  //       currencyBalance: this.user.currencyBalance,
  //       party: party,
  //       mission: mission.name,
  //       difficulty: mission.difficulty,
  //       result: 'Victory',
  //     },
  //   };
  //   this.wsService.sendToServer(message);
  //   return true;
  // }
}
