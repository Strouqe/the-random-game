import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Character } from 'src/app/models/character.model';
import { Mission } from 'src/app/models/mission.model';
import { User } from 'src/app/models/user.model';
import { MissionsService } from 'src/app/services/missions.service';
import { LeaderboardComponent } from '../leaderboard/leaderboard.component';

@Component({
  selector: 'app-mission-result',
  templateUrl: './mission-result.component.html',
  styleUrls: ['./mission-result.component.scss'],
})
export class MissionResultComponent {
  result: any;
  user: User;
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<MissionResultComponent>,
    private missionService: MissionsService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      mission: Mission;
      charectersLeft: Character[];
      party: Character[];
    }
  ) {
     this.missionService.getResult(
      this.data.mission,
      this.data.party
    ).then((result) => {
      this.result = result;
      console.log("mission result component getResult",this.result);
    });
  }

  // openMissionDialog(
  //   enterAnimationDuration: string,
  //   exitAnimationDuration: string
  // ): void {
  //   this.dialog.open(LeaderboardComponent, {
  //     width: '40%',
  //     enterAnimationDuration,
  //     exitAnimationDuration,
  //     data: {},
  //   });
  // }
}
