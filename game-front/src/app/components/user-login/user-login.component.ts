import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  onSubmit(): void {
    this.userService.setUser(this.userForm.value.userName);
    this.userService.initService();
    // this.router.navigate(['/board']);
    this.router.navigate(['/home']);
    this.userService.trigerStart();
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
