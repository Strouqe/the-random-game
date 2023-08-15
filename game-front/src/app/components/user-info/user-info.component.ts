import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, TimeInterval } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { Character } from 'src/app/models/character.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { LeaderboardComponent } from '../leaderboard/leaderboard.component';


export const WS_ENDPOINT = environment.URL;

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit, OnDestroy {
  userSubscription: Subscription;
  user: User;
  message = {}

  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    private wsService: WebsocketService,
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
      data: this.userService.getUser()
    }
    this.userSubscription.unsubscribe()
    this.wsService.sendToServer(this.message);
  }

  onDeleteCharacter(character: Character){
    this.userService.deleteCharacter(character);
  }

    openMissionDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog.open(LeaderboardComponent , {
      width: '30%',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {},
    });
  }

}
