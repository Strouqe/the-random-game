import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { environment } from '../environments/environment';
import { Character } from '../models/character.model';
import { Mission } from '../models/mission.model';
import { User } from '../models/user.model';
import { WebsocketService } from './websocket.service';

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

  constructor(
    private wsService: WebsocketService,
  ) {
    this.charactersChanged = new Subject<Character[]>();
    this.missionsChanged = new Subject<Mission[]>();
    this.playersChanged = new Subject<User[]>();

    this.wsSubscription = this.wsService
      .connect()
      .subscribe((response: any) => {
        console.log('Response from websocket================> ', response);
        this.charactersChanged.next(response.serverData.characters);
        this.missionsChanged.next(response.serverData.missions);
        this.playersChanged.next(response.serverData.currentConnectedUsers);
      });
  }
}
