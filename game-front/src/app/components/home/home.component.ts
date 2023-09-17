import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  userSubscription: Subscription;
  user: User;

  message = {};

  constructor(
    private userService: UserService,
    private wsService: WebsocketService
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.userService.userChanged.subscribe(
      (user: User) => {
        this.user = user;
      }
    );
  }
  ngOnDestroy(): void {
    this.userService.clearTimePlayedInterval();
    this.message = {
      type: 'logout',
      data: this.userService.getUser().name,
    };
    this.wsService.sendToServer(this.message);
    this.userSubscription.unsubscribe();
  }
}
