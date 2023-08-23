import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Character, Characteristics } from 'src/app/models/character.model';
import { Mission } from 'src/app/models/mission.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { MissionResultComponent } from '../mission-result/mission-result.component';

@Component({
  selector: 'app-dialog-animation',
  templateUrl: './dialog-animation.component.html',
  styleUrls: ['./dialog-animation.component.scss'],
})
export class DialogAnimationComponent {
  user: User;
  party: Character[];
  characters: Character[];
  partyStats: Characteristics = {
    strength: 0,
    dexterity: 0,
    intelect: 0,
  };

  missionStarted: boolean;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogAnimationComponent>,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: { mission: Mission; user: User }
  ) {
    this.user = data.user;
    this.party = []
    this.characters = data.user.characters;
    this.missionStarted = false;

    dialogRef.afterClosed().subscribe((result) => {
      this.missionStarted
        ? this.userService.trigerStart()
        : this.resumeGeneration();
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
    this.openMissionDialog('500ms', '500ms');
  }

  drop(event: CdkDragDrop<Character[]>): void {
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
    this.partyStats = this.getPartyStats();
  }

  // sum party charecteristics
  getPartyStats(): Characteristics {
    const stats: Characteristics = {
      strength: 0,
      dexterity: 0,
      intelect: 0,

    };
    this.party.forEach((char) => {
      stats.strength += char.characteristics.strength;
      stats.dexterity += char.characteristics.dexterity;
      stats.intelect += char.characteristics.intelect;
    });
    return stats;
  }



  openMissionDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.user.characters = [...this.characters];
    this.dialog.open(MissionResultComponent, {
      width: '40%',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        mission: this.data.mission,
        charectersLeft: this.characters,
        party: this.party,
      },
    });
  }
}
