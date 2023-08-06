import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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
import { MissionResultComponent } from '../mission-result/mission-result.component';

@Component({
  selector: 'app-dialog-animation',
  templateUrl: './dialog-animation.component.html',
  styleUrls: ['./dialog-animation.component.scss'],
})
export class DialogAnimationComponent {
  user: User;
  party: Character[] = [];
  characters: Character[];

  missionStarted: boolean = false; //temporary fix

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogAnimationComponent>,
    private userService: UserService,
    private missionService: MissionsService,
    @Inject(MAT_DIALOG_DATA) public data: { mission: Mission; user: User }
  ) {
    console.log('data in dialog ====>', data);
    this.user = data.user;
    this.characters = data.user.characters;

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.missionStarted ? this.userService.trigerStart() : this.resumeGeneration();

    });
  }

  resumeGeneration(): void {
    this.userService.trigerStart();
    this.user.characters = [...this.party, ...this.characters];
    this.userService.userChanged.next(this.user);
  }

  onStartMission(): void {
    this.missionStarted = true;
    this.userService.trigerStart();
    console.log('Party when mission is started', this.party);
    this.openMissionDialog('500ms', '500ms');
    // if (this.missionService.startMission(this.data.mission, this.party)) {
    //   console.log('mission compleated');
    // } else {
    //   console.log('mission failed');
    // }
  }

  drop(event: CdkDragDrop<Character[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  openMissionDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
  ): void {
    // this.triggerPauseIncomeGeneration();
    this.user.characters = [ ...this.characters];
    this.dialog.open(MissionResultComponent, {
      width: '40%',
      enterAnimationDuration,
      exitAnimationDuration,
      data: { mission: this.data.mission, charectersLeft: this.characters, party: this.party },
    });
  }
}
