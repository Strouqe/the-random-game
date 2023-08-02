import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { MatListModule } from '@angular/material/list';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './components/board/board.component';
import { charactersComponent } from './components/characters/characters.component';
import { DialogAnimationComponent } from './components/dialog-animation/dialog-animation.component';
import { MissionsComponent } from './components/missions/missions.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlayersOnlineComponent } from './components/players-online/players-online.component';
import { MissionResultComponent } from './components/mission-result/mission-result.component';
@NgModule({
  declarations: [
    AppComponent,
    charactersComponent,
    UserInfoComponent,
    BoardComponent,
    MissionsComponent,
    DialogAnimationComponent,
    UserLoginComponent,
    PlayersOnlineComponent,
    MissionResultComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DragDropModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatListModule,
    MatDialogModule,
    MatDividerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
