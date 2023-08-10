import { Injectable } from '@angular/core';
import { EMPTY, Observable, Observer, Subject, Subscription } from 'rxjs';
import { catchError, switchAll, tap } from 'rxjs/operators';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { environment } from '../environments/environment';
import { ServerData } from '../models/serverData.model';
import { User } from '../models/user.model';

export const WS_ENDPOINT = environment.URL;

interface MessageData {
  type: string;
  data?: User;
}
@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  wsSubscription: Subscription;

  private subject: WebSocketSubject<MessageEvent>;


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

}
