import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ServerDataService } from 'src/app/services/server-data.service';
import { WebsocketService } from 'src/app/services/websocket.service';
@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent implements OnInit, OnDestroy {
  dataSubscription: Subscription;
  dbData: any[];

  constructor(
    private dataService: ServerDataService,
    public dialogRef: MatDialogRef<LeaderboardComponent>,
    private wsService: WebsocketService,
    @Inject(MAT_DIALOG_DATA) public data: {}
  ) {}

  ngOnInit(): void {
    this.wsService.sendToServer({ type: 'dbData request' });
    this.dataSubscription = this.dataService.dbDataChanged.subscribe(
      (dbData) => {
        this.dbData = dbData;
        this.dbData = this.dbData.slice(0, 10);
      }
    );
  }
  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
  }
}
