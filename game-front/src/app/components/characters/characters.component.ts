import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Character } from 'src/app/models/character.model';
import { ServerDataService } from 'src/app/services/server-data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss'],
})
export class charactersComponent implements OnInit, OnDestroy {

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
  }

  ngOnDestroy(): void {
    this.charactersSubscription.unsubscribe();
  }

  onAddcharacter(character: Character): void {
    console.log('character clicked: ', character);
    this.userService.addcharacter(character);
  }
}
