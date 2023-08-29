import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { ServerDataService } from 'src/app/services/server-data.service';
import { UserService } from 'src/app/services/user.service';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  userSubscription: Subscription;
  user: User;

  message = {};


  constructor(private userService: UserService, private router: Router,
    private wsService: WebsocketService) {}

  ngOnInit(): void {
    this.userSubscription = this.userService.userChanged.subscribe(
      (user: User) => {
        this.user = user;
      }
      );
      this.message = {
        type: 'login',
        data: this.userService.getUser(),
      };
      this.wsService.sendToServer(this.message);
  }
  ngOnDestroy(): void {
    this.message = {
      type: 'logout',
      data: this.userService.getUser().name,
    };
    this.wsService.sendToServer(this.message);
    this.userSubscription.unsubscribe();
  }
}
