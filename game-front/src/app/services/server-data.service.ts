import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Charecter } from '../models/charecter.model';
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
  charectersChanged: Subject<Charecter[]>
  missionsChanged: Subject<Mission[]>
  // missions: Subject<Mission[]>

  constructor(private wsService: WebsocketService) {
    this.charectersChanged = new Subject<Charecter[]>()
    this.missionsChanged = new Subject<Mission[]>()
    // this.wsService.connect();
    // this.wsSubscription = this.subject.subscribe((response: any) => {
    //   console.log('test', response);
    //   let data = response;
    //   this.charectersChanged.next(data.characters);
    //   console.log('data service data ', data);

    // });

    this.wsSubscription = this.wsService.connect().subscribe((response: any) => {
      console.log('test', response);
      this.charectersChanged.next(response.serverData.characters);
      this.missionsChanged.next(response.serverData.missions);
      console.log("charectersChanged in server data service",this.charectersChanged)
      console.log("missionsChanged in server data service",this.missionsChanged)
      console.log('data service data ', response.serverData.missions);
    });

    // this.wsSubscription = this.wsService.connect().pipe(
    //   map((response: MessageEvent): Charecter[] => {
    //     let data: Charecter[] = JSON.parse(response.data.charecters);
    //     console.log("Charecters in server data service",data)
    //     return [...data]
    //   })).subscribe((data: Charecter[]) => {
    //     this.charectersChanged.next(data);
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
