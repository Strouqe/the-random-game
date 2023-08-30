import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { LeaderboardComponent } from '../leaderboard/leaderboard.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit, OnDestroy {
  userSubscription: Subscription;
  user: User;
  message = {};

  constructor(
    private router: Router,
    public dialog: MatDialog,
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
    this.message = {
      type: 'logout',
      data: this.userService.getUser(),
    };
    this.userSubscription.unsubscribe();

    this.wsService.sendToServer(this.message);
    this.userService.clearUser();
  }

  openLeaderboardDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog.open(LeaderboardComponent, {
      width: '35%',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {},
    });
  }

  onLogout(): void {
    // this.userService.clearUser();
    this.router.navigate(['/']);
    // this.userService.trigerUpdateState()
    // this.dataService.clearAlldata();
    // window.location.reload()
  }
}
