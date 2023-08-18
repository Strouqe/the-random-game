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

  constructor(
    private wsService: WebsocketService,
    private missionService: MissionsService
  ) {
    this.charactersChanged = new Subject<Character[]>();
    this.missionsChanged = new Subject<Mission[]>();
    this.playersChanged = new Subject<User[]>();
    this.dbDataChanged = new Subject<DbEntry[]>();

    this.wsSubscription = this.wsService
      .connect()
      .subscribe((response: any) => {
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
        }
      });
  }
}
