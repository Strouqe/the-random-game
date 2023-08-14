import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { environment } from '../environments/environment';
import { Character } from '../models/character.model';
import { Mission } from '../models/mission.model';
import { User } from '../models/user.model';
import { WebsocketService } from './websocket.service';
import { DbEntry } from '../models/dbEntry.model';

export const WS_ENDPOINT = environment.URL;

interface Responce {
  serverData: {
    characters: Character[],
    missions: Mission[],
    currentConnectedUsers: User[],
  }
}

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
  ) {
    this.charactersChanged = new Subject<Character[]>();
    this.missionsChanged = new Subject<Mission[]>();
    this.playersChanged = new Subject<User[]>();
    this.dbDataChanged = new Subject<DbEntry[]>();

    this.wsSubscription = this.wsService
      .connect()
      .subscribe((response: Response | any)  => {
        let dbData = JSON.parse(response.serverData.dbdata);
        console.log("server responce",response);
        this.charactersChanged.next(response.serverData.characters);
        this.missionsChanged.next(response.serverData.missions);
        this.playersChanged.next(response.serverData.currentConnectedUsers);
        console.log("dbdata",dbData);
        this.dbDataChanged.next(dbData);
      });
  }
}
