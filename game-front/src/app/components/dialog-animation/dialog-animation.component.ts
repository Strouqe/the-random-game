import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MissionsService } from 'src/app/services/missions.service';
import { UserService } from 'src/app/services/user.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Mission } from 'src/app/models/mission.model';

@Component({
  selector: 'app-dialog-animation',
  templateUrl: './dialog-animation.component.html',
  styleUrls: ['./dialog-animation.component.scss']
})
export class DialogAnimationComponent {
  constructor(public dialogRef: MatDialogRef<DialogAnimationComponent>,
    private userService: UserService,
    private missionService: MissionsService,
    @Inject(MAT_DIALOG_DATA) public data: {mission: Mission}
    ) {
      console.log('data in dialog ====>', data);

    }

    triggerResumeIncomeGeneration(): void {
      this.userService.trigerStart();

      if(this.missionService.startMission(this.data.mission)) {
        console.log("mission compleated")
      } else {
        console.log("mission failed")
      }
    }
}
