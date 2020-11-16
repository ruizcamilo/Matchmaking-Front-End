import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSquadComponent } from './create-squad.component';

describe('CreateSquadComponent', () => {
  let component: CreateSquadComponent;
  let fixture: ComponentFixture<CreateSquadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSquadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSquadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
