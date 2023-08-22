import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { ServerDataService } from 'src/app/services/server-data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  userSubscription: Subscription;
  user: User;


  constructor(private userService: UserService, private router: Router,
    private dataService: ServerDataService) {}

  ngOnInit(): void {
    this.userSubscription = this.userService.userChanged.subscribe(
      (user: User) => {
        this.user = user;
      }
    );
  }
  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  onLogout(): void {
    this.router.navigate(['/']);
    // this.userService.clearUser();
    // this.dataService.clearAlldata();
    window.location.reload()
  }

}
