import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit{
  userForm: FormGroup;

constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.initForm();
  }

  onSubmit() {
    this.userService.setUser(this.userForm.value.userName);
    this.router.navigate(['/board']);
  }

  private initForm(): void {
    this.userForm = new FormGroup({
      userName: new FormControl(null, Validators.required),
      password: new FormControl(null)

    });
  }


}
