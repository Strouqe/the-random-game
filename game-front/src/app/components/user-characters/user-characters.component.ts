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

  public selectedSortVal: string;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.selectedSortVal = 'gold';
    this.userSubscription = this.userService.userChanged.subscribe(
      (user: User) => {
        this.user = user;
        this.user.characters = this.sortCharactersBy(this.selectedSortVal, this.user.characters)
      }
    );
  }
  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  handleOnClick(): void {
    this.user.characters = this.sortCharactersBy(this.selectedSortVal, this.user.characters)
  }
  sortCharactersBy(sortVal: string, characters: Character[]): Character[] {
    switch (sortVal) {
      case 'gold':
        return characters.sort((a, b) => {
          return b.income - a.income;
        });
      case 'strength':
        return characters.sort((a, b) => {
          return b.characteristics.strength - a.characteristics.strength;
        });
      case 'dexterity':
        return characters.sort((a, b) => {
          return b.characteristics.dexterity - a.characteristics.dexterity;
        });
      case 'intellect':
        return characters.sort((a, b) => {
          return b.characteristics.intellect - a.characteristics.intellect;
        });
      default:
        return characters.sort((a, b) => {
          return b.income - a.income;
        });
    }
  }

  onDeleteCharacter(character: Character): void {
    this.userService.deleteCharacter(character);
  }
}
