import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedSquadsComponent } from './feed-squads.component';

describe('FeedSquadsComponent', () => {
  let component: FeedSquadsComponent;
  let fixture: ComponentFixture<FeedSquadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedSquadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedSquadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
