import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DbEntry } from 'src/app/models/dbEntry.model';
import { User } from 'src/app/models/user.model';
import { ServerDataService } from 'src/app/services/server-data.service';
import { UserService } from 'src/app/services/user.service';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-final-screen',
  templateUrl: './final-screen.component.html',
  styleUrls: ['./final-screen.component.scss'],
})
export class FinalScreenComponent {
  userSubscription: Subscription;
  dataSubscription: Subscription;
  user: User;
  dbData: any[];
  message = {};
  userEntry: DbEntry;

  constructor(
    private dataService: ServerDataService,
    private userService: UserService,
    private wsService: WebsocketService,
    private router: Router,
    public dialogRef: MatDialogRef<FinalScreenComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      user: User;
    }
  ) {
    console.log('data in final screen component', data);
    console.log('user in final screen component', data.user);
    console.log('points in final screen component', data.user.points);
    this.user = data.user;
    this.userService.trigerPause();
    dialogRef.afterClosed().subscribe(() => {
      router.navigate(['/']);
    });

    // this.wsService.sendToServer({ type: 'data request' });
    // this.userSubscription = this.userService.userChanged.subscribe((user) => {
    //   this.user = user;
    // });
    this.wsService.sendToServer({ type: 'data request' });
    this.dataSubscription = this.dataService.dbDataChanged.subscribe(
      (dbData) => {
        this.dbData = dbData;
        this.userEntry = {
          id: 0,
          name: this.data.user.name,
          balance: this.data.user.currencyBalance,
          timePlayed: this.data.user.timePlayed,
          points: this.data.user.points,
        };
        this.dbData.push(this.userEntry);
        this.dbData.sort((a, b) => {
          return b.points - a.points;
        });
        // this.dbData = this.dbData.slice(0, 10);
      }
    );
    console.log('final screen dialog db', this.dbData);
    this.message = {
      type: 'end user session',
      data: JSON.stringify(this.data.user),
    };
    this.wsService.sendToServer(this.message);
  }

  ngOnInit(): void {
    // this.wsService.sendToServer({ type: 'data request' });
  }
  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
  }

  onRestart() {
    this.router.navigate(['/']);
  }
}
