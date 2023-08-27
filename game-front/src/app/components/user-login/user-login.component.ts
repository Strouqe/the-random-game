import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerDataService } from 'src/app/services/server-data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
})
export class UserLoginComponent implements OnInit {
  userForm: FormGroup;

  constructor(
    private userService: UserService,
    private dataService: ServerDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  onSubmit(): void {
    this.dataService.nameValidation(this.userForm.value.userName).then((res) => {
      if(res) {
        this.userService.setUser(this.userForm.value.userName);
        this.userService.initService();
        // this.router.navigate(['/board']);
        this.router.navigate(['/home']);
        this.userService.trigerStart();
      } else {
        alert('User name already in use');
      }
    })


  }

  private initForm(): void {
    this.userForm = new FormGroup({
      userName: new FormControl(null, [
        Validators.minLength(4),
        Validators.required,
      ]),
    });
  }
}
