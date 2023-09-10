import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Character } from 'src/app/models/character.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-characters',
  templateUrl: './user-characters.component.html',
  styleUrls: ['./user-characters.component.scss'],
})
export class UserCharactersComponent {
  userSubscription: Subscription;
  user: User;

  constructor(private userService: UserService,) {}

  ngOnInit(): void {
    this.userSubscription = this.userService.userChanged.subscribe(
      (user: User) => {
        this.user = user;
        this.user.characters = this.sortCharacters(this.user.characters);
      }
    );
  }
  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
  sortCharacters(characters: Character[]): Character[] {
    return characters.sort((a, b) => {
      return b.price - a.price;
    });
  }
  onDeleteCharacter(character: Character): void {
    this.userService.deleteCharacter(character);
  }
}
