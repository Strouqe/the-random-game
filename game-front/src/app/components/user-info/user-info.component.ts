import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { environment } from 'src/app/environments/environment';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { Buffer } from 'buffer';
import { ChatService } from 'src/app/services/chat.service';
import { ServerDataService } from 'src/app/services/server-data.service';


export const WS_ENDPOINT = environment.URL;

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit, OnDestroy {
  userSubscription: Subscription;

  user: User;


  constructor(
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {

    this.userSubscription = this.userService.userChanged.subscribe(
      (user: User) => {
        this.user = user;
        console.log("User in user component ====>", this.user);
      }
    );
    this.userService.fetchUser();
    // this.userService.incomeGenerator$.subscribe((income) => {
    //   console.log('income', income);
    // }
    // );
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

}
