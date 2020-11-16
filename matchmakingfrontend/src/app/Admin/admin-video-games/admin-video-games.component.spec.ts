import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVideoGamesComponent } from './admin-video-games.component';

describe('AdminVideoGamesComponent', () => {
  let component: AdminVideoGamesComponent;
  let fixture: ComponentFixture<AdminVideoGamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminVideoGamesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminVideoGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
