import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Character } from '../models/character.model';
import { Mission } from '../models/mission.model';
import { ServerData } from '../models/serverData.model';
import { webSocket } from 'rxjs/webSocket';
import { environment } from '../environments/environment';

export const WS_ENDPOINT = environment.URL;

@Injectable({
  providedIn: 'root'
})
export class ServerDataService {
  wsSubscription: Subscription;
  subject = webSocket(WS_ENDPOINT)
  charactersChanged: Subject<Character[]>
  missionsChanged: Subject<Mission[]>
  playersChanged: Subject<string[]>
  // missions: Subject<Mission[]>

  constructor(private wsService: WebsocketService) {
    this.charactersChanged = new Subject<Character[]>()
    this.missionsChanged = new Subject<Mission[]>()
    this.playersChanged = new Subject<string[]>()

    // this.wsService.connect();
    // this.wsSubscription = this.subject.subscribe((response: any) => {
    //   console.log('test', response);
    //   let data = response;
    //   this.charactersChanged.next(data.characters);
    //   console.log('data service data ', data);

    // });


    this.wsSubscription = this.wsService.connect().subscribe((response: any) => {
      console.log('test', response);
      this.charactersChanged.next(response.serverData.characters);
      this.missionsChanged.next(response.serverData.missions);
      this.playersChanged.next(response.serverData.currentConnectedUsers);
      console.log("charactersChanged in server data service",this.charactersChanged)
      console.log("missionsChanged in server data service",this.missionsChanged)
      console.log("playersChanged in server data service",this.playersChanged)
      console.log('data service data ', response.serverData);
    });


    // this.wsSubscription = this.wsService.connect().pipe(
    //   map((response: MessageEvent): character[] => {
    //     let data: character[] = JSON.parse(response.data.characters);
    //     console.log("characters in server data service",data)
    //     return [...data]
    //   })).subscribe((data: character[]) => {
    //     this.charactersChanged.next(data);
    //   })

    // this.missions = <Subject<Mission[]>>wsService.connect().pipe(
    //   map((response: MessageEvent): Mission[] => {
    //     let data: Mission[] = JSON.parse(response.data.missions);
    //     console.log("Missions in server data service",data)
    //     return [...data]
    //   }
    //   ))

   }

}
