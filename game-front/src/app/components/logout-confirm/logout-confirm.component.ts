import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout-confirm',
  templateUrl: './logout-confirm.component.html',
  styleUrls: ['./logout-confirm.component.scss']
})
export class LogoutConfirmComponent {
  constructor(

    public dialogRef: MatDialogRef<LogoutConfirmComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: {}
  ) {}

  onLogout(): void {
    this.router.navigate(["/"])
  }
}
