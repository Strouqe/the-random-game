import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Character } from 'src/app/models/character.model';
import { Mission } from 'src/app/models/mission.model';
import { User } from 'src/app/models/user.model';
import { MissionsService } from 'src/app/services/missions.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-mission-result',
  templateUrl: './mission-result.component.html',
  styleUrls: ['./mission-result.component.scss']
})
export class MissionResultComponent {
  result: boolean;
  user: User;
  constructor(public dialogRef: MatDialogRef<MissionResultComponent>, private userService: UserService,private missionService: MissionsService,
    @Inject(MAT_DIALOG_DATA) public data: {mission: Mission, charectersLeft: Character[], party: Character[]}
    ) {
      this.result = this.missionService.startMission(this.data.mission, this.data.party, this.data.charectersLeft);

      // if(this.result){
      //   this.user.characters = [...this.user.characters, ...this.data.party];
      //   this.userService.userChanged.next(this.user);
      // } else {
      //   this.user.characters = this.user.characters.filter((character) => {
      //     return character.name !== character.name
      //   })
      //   this.userService.userChanged.next(this.user);
      // }
    }
}
