import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Character } from 'src/app/models/character.model';
import { Mission, MissionResults } from 'src/app/models/mission.model';
import { User } from 'src/app/models/user.model';
import { MissionsService } from 'src/app/services/missions.service';
import { UserService } from 'src/app/services/user.service';
import { FinalScreenComponent } from '../final-screen/final-screen.component';

@Component({
  selector: 'app-mission-result',
  templateUrl: './mission-result.component.html',
  styleUrls: ['./mission-result.component.scss'],
})
export class MissionResultComponent implements OnInit {
  result: boolean;
  points: number;
  results: MissionResults;
  user: User;
  userSubscription: Subscription;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<MissionResultComponent>,
    private missionService: MissionsService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      mission: Mission;
      charectersLeft: Character[];
      party: Character[];
    }
  ) {
    this.missionService
      .getResult(this.data.mission, this.data.party)
      .then((results) => {
        this.result = results.result;
        this.points = results.points;
      });
  }

  ngOnInit() {
    this.userSubscription = this.userService.userChanged.subscribe(
      (user: User) => {
        this.user = user;
      }
    );
    this.dialogRef.afterClosed().subscribe(() => {
      // check if the user has compleated 10 missions
      if (this.userService.getUser().missionsCompleated.length >= 10) {
        this.missionService.finalPointCount();
        this.openMissionDialog('500ms', '500ms');
      }
    });
  }

  openMissionDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog.open(FinalScreenComponent, {
      width: '40%',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        user: this.user,
      },
      autoFocus: false,
    });
  }

  getPenalty(character: Character, mission: Mission) {
    let statPenalty = 2;
    if (character.level * 100 - mission.difficulty > 0) {
      statPenalty += ((character.level * 100 - mission.difficulty) / 100) * 2;
    }
    return statPenalty;
  }
}
