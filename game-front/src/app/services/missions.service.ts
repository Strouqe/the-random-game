import { Injectable } from '@angular/core';
import { Characteristics } from '../models/charecter.model';
import { UserService } from './user.service';
import { User } from '../models/user.model';
import { Subscription } from 'rxjs';
import { Mission } from '../models/mission.model';

@Injectable({
  providedIn: 'root',
})
export class MissionsService {
  userSubscription: Subscription;
  private user: User

  constructor(private userService: UserService) {

    this.userSubscription = this.userService.userChanged.subscribe(
      (user: User) => {
        this.user = user;
        console.log("User in user component ====>", this.user);
      }
    );
  }

  startMission(mission: Mission): boolean {  //  Should I ad min charecters?
    const req = this.getReq(mission.dificulty); // Won't be needed when I will get req from the server
    console.log('req', req);
    for(const charecter in this.user.charecters){
      if(this.user.charecters[charecter].characteristics.strength < req.strength && this.user.charecters[charecter].characteristics.dexterity < req.dexterity && this.user.charecters[charecter].characteristics.intelect < req.intelect){
        this.user.charecters = []
        this.userService.userChanged.next(this.user);
        return false;
      }
    }
    this.user.currencyBalance += mission.reward;
    this.userService.userChanged.next(this.user);
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
