import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Charecter } from 'src/app/models/charecter.model';
import { User } from 'src/app/models/user.model';
import { ServerDataService } from 'src/app/services/server-data.service';
import { UserService } from 'src/app/services/user.service';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-charecters',
  templateUrl: './charecters.component.html',
  styleUrls: ['./charecters.component.scss'],
})
export class CharectersComponent implements OnInit, OnDestroy {

  charecters: Charecter[];

  charectersSubscription: Subscription;

  constructor(
    private dataService: ServerDataService,
    private userService: UserService,
    // public webSocketService: WebsocketService,

  ) {
  }

  ngOnInit(): void {
    // this.webSocketService.connect();

    this.charectersSubscription = this.dataService.charectersChanged.subscribe((charecters) => {
      this.charecters = charecters;
      console.log('Response from websocket: ', charecters);
    });
    console.log('charecters in charecters component ====>', this.charecters);
  }

  ngOnDestroy(): void {
    this.charectersSubscription.unsubscribe();
  }

  onAddCharecter(charecter: Charecter): void {
    console.log('Charecter clicked: ', charecter);
    this.userService.addCharecter(charecter);
  }
}
