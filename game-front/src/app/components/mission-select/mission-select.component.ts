import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Character, Characteristics } from 'src/app/models/character.model';
import { Mission } from 'src/app/models/mission.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { MissionResultComponent } from '../mission-result/mission-result.component';
import { max } from 'rxjs';

@Component({
  selector: 'app-mission-select',
  templateUrl: './mission-select.component.html',
  styleUrls: ['./mission-select.component.scss'],
})
export class MissionSelectComponent {
  user: User;
  party: Character[];
  characters: Character[];
  partyStats: Characteristics = {
    strength: 0,
    dexterity: 0,
    intellect: 0,
  };
  successProbability: number = 0;

  missionStarted: boolean;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<MissionSelectComponent>,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: { mission: Mission; user: User }
  ) {
    this.user = data.user;
    this.party = [];
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
    this.successProbability = this.calculateTotalProbability();
  }

  // sum party charecteristics
  getPartyStats(): Characteristics {
    const stats: Characteristics = {
      strength: 0,
      dexterity: 0,
      intellect: 0,
    };
    this.party.forEach((char) => {
      stats.strength += char.characteristics.strength;
      stats.dexterity += char.characteristics.dexterity;
      stats.intellect += char.characteristics.intellect;
    });
    return stats;
  }

  calculateProbability(myNumber: number, minRange: number, maxRange: number): number {
    if ( myNumber > maxRange) {
      return 1;
    }
    if ( myNumber < minRange) {
      return 0;
    }
    const totalOutcomes = maxRange - minRange + 1;
    const favorableOutcomes = myNumber - minRange;

    const probability = favorableOutcomes / totalOutcomes;
    ;
    return probability;
  }
  calculateTotalProbability(): number {
    let minRange = 10 * (this.data.mission.difficulty / 100) * 4;
    let maxRange = 20 * (this.data.mission.difficulty / 100) * 4;
    let partyStats = this.getPartyStats();
    let totalProbability = this.calculateProbability(partyStats.strength, minRange, maxRange) * this.calculateProbability(partyStats.dexterity, minRange, maxRange) * this.calculateProbability(partyStats.intellect, minRange, maxRange);
    console.log("totalProbability", totalProbability);
    ;
    return Math.round(totalProbability * 100);
  }

  addCharacterToParty(character: Character): void {
    this.party.push(character);
    this.characters = this.characters.filter((char) => char !== character);
  }
  returnCharacterToUser(character: Character): void {
    this.characters.push(character);
    this.party = this.party.filter((char) => char !== character);
  }


  openMissionDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.user.characters = [...this.characters];
    this.dialog.open(MissionResultComponent, {
      width: '45%',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        mission: this.data.mission,
        charectersLeft: this.characters,
        party: this.party,
        autoFocus: false,
      },
    });
  }
}
