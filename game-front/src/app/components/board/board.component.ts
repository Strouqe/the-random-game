import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy{
  userSubscription: Subscription;

  user: User;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userSubscription = this.userService.userChanged.subscribe(
      (user: User) => {
        this.user = user;
        console.log("User in board component ====>",this.user);
      }
    );
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
