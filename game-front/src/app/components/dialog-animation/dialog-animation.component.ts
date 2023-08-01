import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MissionsService } from 'src/app/services/missions.service';
import { UserService } from 'src/app/services/user.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Mission } from 'src/app/models/mission.model';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { User } from 'src/app/models/user.model';
import { Subscription } from 'rxjs';
import { Character } from 'src/app/models/character.model';

@Component({
  selector: 'app-dialog-animation',
  templateUrl: './dialog-animation.component.html',
  styleUrls: ['./dialog-animation.component.scss']
})
export class DialogAnimationComponent{
  user: User;
  party: Character[] = []
  characters: Character[]

  constructor(public dialogRef: MatDialogRef<DialogAnimationComponent>,
    private userService: UserService,
    private missionService: MissionsService,
    @Inject(MAT_DIALOG_DATA) public data: {mission: Mission, user: User}
    ) {
      console.log('data in dialog ====>', data);
      this.user = data.user
      this.characters = data.user.characters

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.resumeGeneration()
      });

    }

    resumeGeneration(): void {
      this.userService.trigerStart();
      this.user.characters = [...this.party, ...this.characters]
    }

    onStartMission(): void {
      this.userService.trigerStart();
      console.log("Party when mission is started", this.party)
      if(this.missionService.startMission(this.data.mission, this.party)) {
        console.log("mission compleated")
      } else {
        console.log("mission failed")
      }
    }

    drop(event: CdkDragDrop<Character[]>) {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
      }
    }
}
