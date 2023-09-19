import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EncryptStorage } from 'encrypt-storage';
import { ServerDataService } from 'src/app/services/server-data.service';
import { UserService } from 'src/app/services/user.service';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
})
export class UserLoginComponent implements OnInit {
  @ViewChild('image') public img: ElementRef;
  userForm: FormGroup;
  encryptStorage: EncryptStorage;
  backgroundLoaded: boolean;
  constructor(
    private userService: UserService,
    private dataService: ServerDataService,
    private router: Router,
    private wsService: WebsocketService
  ) {
    this.backgroundLoaded = false;
  }

  ngOnInit(): void {
    this.initForm();
    if (this.userService.getUserFromMemory()) {
      this.userService.initService();
      this.router.navigate(['/home']);
      this.userService.setUserFromMemory();
      this.userService.trigerStart();
    }
  }
  ngAfterViewInit() {
    const image: HTMLImageElement = this.img.nativeElement;

    image.onload = () => {
      console.log('image loaded');
      this.backgroundLoaded = true;
    };
  }
  
  onSubmit(): void {
    this.dataService
      .nameValidation(this.userForm.value.userName)
      .then((res) => {
        if (res) {
          this.userService.setUser(this.userForm.value.userName);
          this.userService.initService();
          this.router.navigate(['/home']);
          this.userService.trigerStart();
          this.userService.setUserStorage();
          let message = {
            type: 'login',
            data: this.userService.getUser(),
          };
          this.wsService.sendToServer(message);
        } else {
          alert('User name already in use');
        }
      });
  }

  private initForm(): void {
    this.userForm = new FormGroup({
      userName: new FormControl(null, [
        Validators.minLength(4),
        Validators.maxLength(10),
        Validators.required,
        Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)
      ]),
    });
  }
}
