import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Message } from 'src/app/models/serverData.model';
import { User } from 'src/app/models/user.model';
import { ServerDataService } from 'src/app/services/server-data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-players-online',
  templateUrl: './players-online.component.html',
  styleUrls: ['./players-online.component.scss'],
  animations: [
    trigger('scroll', [
      state('on', style({ left: '-100px' })),
      transition('* => *', [
        style({ left: '-100px' }),
        animate(10000, style({ left: '100%' })),
      ]),
    ]),
  ],
})
export class PlayersOnlineComponent implements OnInit, OnDestroy {
  playersSubscription: Subscription;
  userSubscription: Subscription;
  players: User[];
  user: User;
  message: Message;

  animationState = 0;

  constructor(
    private dataService: ServerDataService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.playersSubscription = this.dataService.playersChanged.subscribe(
      (players) => {
        this.players = players;
      }
    );
    this.userSubscription = this.userService.userChanged.subscribe(
      (user: User) => {
        this.user = user;
      }
    );
  }

  ngOnDestroy(): void {
    this.playersSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  scrollDone(): void {
    this.animationState++;
  }
}
