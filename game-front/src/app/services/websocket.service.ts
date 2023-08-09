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
}
