import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Mission } from 'src/app/models/mission.model';
import { MissionsService } from 'src/app/services/missions.service';
import { ServerDataService } from 'src/app/services/server-data.service';
import { UserService } from 'src/app/services/user.service';
import { DialogAnimationComponent } from '../dialog-animation/dialog-animation.component';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-missions',
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.scss'],
})
export class MissionsComponent implements OnInit, OnDestroy {
  user: User;
  userSubscription: Subscription;
  missions: Mission[];
  currentMission: Mission; // For easier access to the current mission

  missionsSubscription: Subscription;

  constructor(
    public dialog: MatDialog,
    private dataService: ServerDataService,
    private userService: UserService,
    private missionService: MissionsService
  ) {}

  ngOnInit(): void {
    this.missionsSubscription = this.dataService.missionsChanged.subscribe(
      (missions) => {
        this.missions = missions;
        console.log('Response from websocket: ', missions);
      }
    );
    this.userSubscription = this.userService.userChanged.subscribe((user) => {
      this.user = user;
      console.log('User in mission component ====>', this.user);
    });
    console.log('missions in missions component ====>', this.missions);
  }

  ngOnDestroy(): void {
    this.missionsSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  onMissionClick(mission: Mission): void {
    console.log('Mission clicked: ', mission);
    // this.missionService.startMission(mission);
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

  //generate a randome whole number from 10 to 25
}
