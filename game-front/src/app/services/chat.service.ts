import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Message {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  messages: Subject<Message>

  constructor(private wsService: WebsocketService) {
    this.messages = <Subject<Message>>wsService.connect().pipe(
      map((response: MessageEvent): Message => {
        let data = JSON.parse(response.data);
        return {
          message: data
        }
      }))

   }
}
