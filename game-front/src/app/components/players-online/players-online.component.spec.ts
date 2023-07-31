import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersOnlineComponent } from './players-online.component';

describe('PlayersOnlineComponent', () => {
  let component: PlayersOnlineComponent;
  let fixture: ComponentFixture<PlayersOnlineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayersOnlineComponent]
    });
    fixture = TestBed.createComponent(PlayersOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
