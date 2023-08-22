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
  userSubscription: Subscription;
  charactersSubscription: Subscription;
  user: User;
  characters: Character[];
  fullParty: boolean;

  constructor(
    private dataService: ServerDataService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.fullParty = false;
    this.charactersSubscription = this.dataService.charactersChanged.subscribe(
      (characters) => {
        this.characters = characters;
      }
    );
    this.userSubscription = this.userService.userChanged.subscribe((user) => {
      this.user = user;
      this.user.characters.length <= 5
        ? (this.fullParty = false)
        : (this.fullParty = true);
    });
  }

  ngOnDestroy(): void {
    this.charactersSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  onAddcharacter(character: Character): void {
    this.characters = this.characters.filter(
      (char) => char.id !== character.id
    );
    this.userService.addcharacter(character);
  }
}
