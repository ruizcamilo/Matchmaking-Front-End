import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SquadViewComponent } from './squad-view.component';

describe('SquadViewComponent', () => {
  let component: SquadViewComponent;
  let fixture: ComponentFixture<SquadViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SquadViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SquadViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
