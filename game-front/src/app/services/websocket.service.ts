import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { environment } from '../environments/environment';

export const WS_ENDPOINT = environment.URL;

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
