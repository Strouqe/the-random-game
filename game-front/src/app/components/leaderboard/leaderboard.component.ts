import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Character } from 'src/app/models/character.model';
import { Mission } from 'src/app/models/mission.model';
import { User } from 'src/app/models/user.model';
import { ServerDataService } from 'src/app/services/server-data.service';
import { UserService } from 'src/app/services/user.service';
import { WebsocketService } from 'src/app/services/websocket.service';
@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit, OnDestroy {
  dataSubscription: Subscription;
  dbData: any[]


    constructor(private dataService: ServerDataService,
      public dialogRef: MatDialogRef<LeaderboardComponent>,
      private wsService: WebsocketService,
      @Inject(MAT_DIALOG_DATA) public data: { }) { }

  ngOnInit(): void {
    this.wsService.sendToServer({ type: 'data request' });
    this.dataSubscription = this.dataService.dbDataChanged.subscribe(
      (dbData) => {
        this.dbData = dbData
        this.dbData = this.dbData.slice(Math.max(this.dbData.length - 10, 0))
        console.log("leaderboard dialog", this.dbData)
      }
    );
  }
  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
  }
}
