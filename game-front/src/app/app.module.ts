import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { charactersComponent } from './components/characters/characters.component';
import { DialogAnimationComponent } from './components/dialog-animation/dialog-animation.component';
import { HomeComponent } from './components/home/home.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { MissionResultComponent } from './components/mission-result/mission-result.component';
import { MissionsComponent } from './components/missions/missions.component';
import { PlayersOnlineComponent } from './components/players-online/players-online.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { NavComponent } from './components/nav/nav.component';
import { UserCharactersComponent } from './components/user-characters/user-characters.component';

@NgModule({
  declarations: [
    AppComponent,
    charactersComponent,
    MissionsComponent,
    DialogAnimationComponent,
    UserLoginComponent,
    PlayersOnlineComponent,
    MissionResultComponent,
    LeaderboardComponent,
    HomeComponent,
    NavComponent,
    UserCharactersComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DragDropModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatExpansionModule,
    MatListModule,
    MatDialogModule,
    MatDividerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
