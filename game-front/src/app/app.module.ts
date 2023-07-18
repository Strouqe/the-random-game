import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CharectersComponent } from './components/charecters/charecters.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { BoardComponent } from './components/board/board.component';
import { MissionsComponent } from './components/missions/missions.component';
import { FormsModule } from '@angular/forms';
import { DialogAnimationComponent } from './components/dialog-animation/dialog-animation.component';

@NgModule({
  declarations: [
    AppComponent,
    CharectersComponent,
    UserInfoComponent,
    BoardComponent,
    MissionsComponent,
    DialogAnimationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatCardModule,
    MatListModule,
    MatDialogModule,
    MatDividerModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
