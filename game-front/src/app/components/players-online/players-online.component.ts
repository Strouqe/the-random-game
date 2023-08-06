import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { ServerDataService } from 'src/app/services/server-data.service';
import { UserService } from 'src/app/services/user.service';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-players-online',
  templateUrl: './players-online.component.html',
  styleUrls: ['./players-online.component.scss'],
})
export class PlayersOnlineComponent implements OnInit, OnDestroy {
  players: User[];
  playersSubscription: Subscription;

  userSubscription: Subscription;

  user: User;

  message = {}


  constructor(
    private dataService: ServerDataService,
    private userService: UserService,
    private wsService: WebsocketService,
  ) {}

  ngOnInit(): void {
    this.playersSubscription = this.dataService.playersChanged.subscribe(
      (players) => {
        this.players = players;
        console.log('player in players onlone component ====> ', players);
      }
    );

    this.userSubscription = this.userService.userChanged.subscribe(
      (user: User) => {
        this.user = user;
        console.log('User in players onlone component ====>', this.user);
      }
    );

    this.message = {
      type: 'login',
      data: this.userService.getUser()
    }

    this.wsService.sendToServer(this.message);

  }

  ngOnDestroy(): void {
    this.playersSubscription.unsubscribe();
    this.userSubscription.unsubscribe();

    this.message = {
      type: 'logout',
      data: this.userService.getUser().name
    }

    this.wsService.sendToServer(this.message);
  }
}
