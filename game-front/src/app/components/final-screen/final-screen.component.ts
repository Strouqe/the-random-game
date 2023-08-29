import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { ServerDataService } from 'src/app/services/server-data.service';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-final-screen',
  templateUrl: './final-screen.component.html',
  styleUrls: ['./final-screen.component.scss'],
})
export class FinalScreenComponent {
  dataSubscription: Subscription;
  dbData: any[];
  message = {}

  constructor(
    private dataService: ServerDataService,
    private wsService: WebsocketService,
    private router: Router,
    public dialogRef: MatDialogRef<FinalScreenComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      user: User;
    }
  ) {
    this.dialogRef.afterClosed().subscribe(() => {
      router.navigate(['/'])
    });
  }

  ngOnInit(): void {
    this.message = {
      type: 'end user session',
      data: this.data.user,
    };
    this.wsService.sendToServer(this.message);
    // this.wsService.sendToServer({ type: 'data request' });
    this.dataSubscription = this.dataService.dbDataChanged.subscribe(
      (dbData) => {
        this.dbData = dbData;
        // this.dbData = this.dbData.slice(Math.max(this.dbData.length - 10, 0));
        console.log('leaderboard dialog', this.dbData);
      }
    );
  }
  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();

  }

  onRestart() {}
}
