import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Mission } from 'src/app/models/mission.model';
import { User } from 'src/app/models/user.model';
import { ServerDataService } from 'src/app/services/server-data.service';
import { UserService } from 'src/app/services/user.service';
import { DialogAnimationComponent } from '../dialog-animation/dialog-animation.component';

@Component({
  selector: 'app-missions',
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.scss'],
})
export class MissionsComponent implements OnInit, OnDestroy {
  user: User;
  userSubscription: Subscription;
  missions: Mission[];
  currentMission: Mission;

  missionsSubscription: Subscription;

  constructor(
    public dialog: MatDialog,
    private dataService: ServerDataService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.missionsSubscription = this.dataService.missionsChanged.subscribe(
      (missions) => {
        this.missions = missions;
      }
    );
    this.userSubscription = this.userService.userChanged.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnDestroy(): void {
    this.missionsSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  triggerPauseIncomeGeneration(): void {
    this.userService.trigerPause();
  }

  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
    mission: Mission
  ): void {
    this.triggerPauseIncomeGeneration();
    this.dialog.open(DialogAnimationComponent, {
      width: '95%',
      enterAnimationDuration,
      exitAnimationDuration,
      data: { mission: mission, user: this.user },
    });
  }
}
