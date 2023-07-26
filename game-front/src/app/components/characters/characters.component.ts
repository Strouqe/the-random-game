import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Character } from 'src/app/models/character.model';
import { User } from 'src/app/models/user.model';
import { ServerDataService } from 'src/app/services/server-data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss'],
})
export class charactersComponent implements OnInit, OnDestroy {
  user: User;
  userSubscription: Subscription;
  fullParty: boolean = false;

  characters: Character[];
  charactersSubscription: Subscription;

  constructor(
    private dataService: ServerDataService,
    private userService: UserService,
    // public webSocketService: WebsocketService,

  ) {
  }

  ngOnInit(): void {
    // this.webSocketService.connect();

    this.charactersSubscription = this.dataService.charactersChanged.subscribe((characters) => {
      this.characters = characters;
      console.log('Response from websocket: ', characters);
    });
    console.log('characters in characters component ====>', this.characters);

    this.userSubscription = this.userService.userChanged.subscribe((user) => {
      this.user = user;
      this.user.characters.length <= 5 ? this.fullParty = false : this.fullParty = true;
      console.log('User in characters component ====>', this.user);
    }
    );
  }

  ngOnDestroy(): void {
    this.charactersSubscription.unsubscribe();
  }

  onAddcharacter(character: Character): void {
    console.log('character clicked: ', character);
    this.userService.addcharacter(character);
  }
}
