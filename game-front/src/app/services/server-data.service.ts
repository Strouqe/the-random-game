import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { environment } from '../environments/environment';
import { Character } from '../models/character.model';
import { Mission } from '../models/mission.model';
import { User } from '../models/user.model';
import { WebsocketService } from './websocket.service';
import { DbEntry } from '../models/dbEntry.model';
import { MissionsService } from './missions.service';
import { Router } from '@angular/router';

export const WS_ENDPOINT = environment.URL;

@Injectable({
  providedIn: 'root',
})
export class ServerDataService {
  wsSubscription: Subscription;
  subject = webSocket(WS_ENDPOINT);
  charactersChanged: Subject<Character[]>;
  missionsChanged: Subject<Mission[]>;
  playersChanged: Subject<User[]>;
  dbDataChanged: Subject<DbEntry[]>;

  namePromiseResolve: any;
  namePromiseReject: any;
  message = {}

  constructor(
    private wsService: WebsocketService,
    private missionService: MissionsService,
    private router: Router
  ) {
    this.charactersChanged = new Subject<Character[]>();
    this.missionsChanged = new Subject<Mission[]>();
    this.playersChanged = new Subject<User[]>();
    this.dbDataChanged = new Subject<DbEntry[]>();

    this.wsSubscription = this.wsService
      .connect()
      .subscribe((response: any) => {
        console.log("responce from server ====>",response);
        switch (response.type) {
          case 'data responce':
            let dbData = JSON.parse(response.data.dbdata);
            this.charactersChanged.next(response.data.characters);
            this.missionsChanged.next(response.data.missions);
            this.playersChanged.next(response.data.currentConnectedUsers);
            this.dbDataChanged.next(dbData);
            break;
          case 'mission result responce':
            this.missionService.promiseResolve(response.data);
            break;
          case 'name validation':
            // this.onForceLogout();
            if(response.data == 'invalid'){
              this.namePromiseResolve(false);
            }else{
              this.namePromiseResolve(true);
            }
            break;
        }
      });
  }

  async nameValidation(name: string) {
    this.message = {
      type: 'name validation',
      data: name,
    };
    this.wsService.sendToServer(this.message);
    let result = await new Promise((resolve, reject) => {
      this.namePromiseResolve = resolve;
      this.namePromiseReject = reject;
    }).then((result) => {
      if(result == false){
        return false;
      }else{
        return true;
      }
    });
    return result;
    }


  // onForceLogout(): void {
  //   this.router.navigate(['/']);
  //   window.location.reload()
  //   console.log('force logout');
  // }

  clearAlldata(){
    this.charactersChanged.next([]);
    this.missionsChanged.next([]);
    this.playersChanged.next([]);
    this.dbDataChanged.next([]);
  }
}
