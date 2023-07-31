import { Injectable } from '@angular/core';
import { EMPTY, Observable, Observer, Subject, Subscription } from 'rxjs';
import { catchError, switchAll, tap } from 'rxjs/operators';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { environment } from '../environments/environment';
import { ServerData } from '../models/serverData.model';

export const WS_ENDPOINT = environment.URL;

interface MessageData {
  message: string;
  time?: string;
}
@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  wsSubscription: Subscription;
  dataChanged = new Subject<ServerData>();

  private subject: WebSocketSubject<MessageEvent>;

  message = {};

  constructor() {}

  public connect() {
    if (!this.subject) {
      this.subject = webSocket(WS_ENDPOINT);
      console.log('this.subject', this.subject);
    }
    return this.subject;
  }

  sendToServer(data: any) {
    this.subject.next(data);
  }

  login(name: string) {
    this.message = {
      type: 'login',
      data: name
    }
    this.sendToServer(this.message);
  }

  // private create(url: string): WebSocketSubject<MessageEvent> {
  //   let ws = new WebSocket(url);

  //   let observable = new Observable((obs: Observer<MessageEvent>) => {
  //     ws.onmessage = obs.next.bind(obs);
  //     ws.onerror = obs.error.bind(obs);
  //     ws.onclose = obs.error.bind(obs);
  //     return ws.close.bind(ws);
  //   });

  //   let observer = {
  //     next: (data: Object) => {
  //       if (ws.readyState === WebSocket.OPEN) {
  //         ws.send(JSON.stringify(data));
  //       }
  //     },
  //   };
  //   return WebSocketSubject.create(observer, observable);
  // }
}
