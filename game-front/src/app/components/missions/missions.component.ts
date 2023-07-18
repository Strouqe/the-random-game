import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Mission } from 'src/app/models/mission.model';
import { ServerDataService } from 'src/app/services/server-data.service';
import { DialogAnimationComponent } from '../dialog-animation/dialog-animation.component';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { Characteristics } from 'src/app/models/charecter.model';
import { MissionsService } from 'src/app/services/missions.service';

@Component({
  selector: 'app-missions',
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.scss']
})
export class MissionsComponent implements OnInit, OnDestroy{
  missions: Mission[];
  currentMission: Mission; // For easier access to the current mission

  missionsSubscription: Subscription;

  constructor(
    public dialog: MatDialog,
    private dataService: ServerDataService,
    private userService: UserService,
    private missionService: MissionsService,
    ) { }

  ngOnInit(): void {
    this.missionsSubscription = this.dataService.missionsChanged.subscribe((missions) => {
      this.missions = missions;
      console.log('Response from websocket: ', missions);
    });
    console.log('missions in missions component ====>', this.missions);
  }

  ngOnDestroy(): void {
    this.missionsSubscription.unsubscribe();
  }

  onMissionClick(mission: Mission): void {
    console.log('Mission clicked: ', mission);
    this.missionService.startMission(mission);
  }

  triggerPauseIncomeGeneration(): void {
    this.userService.trigerPause();
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, mission: Mission): void {
    this.triggerPauseIncomeGeneration();
    this.dialog.open(DialogAnimationComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {mission: mission}
    });
  }

  //generate a randome whole number from 10 to 25

}


