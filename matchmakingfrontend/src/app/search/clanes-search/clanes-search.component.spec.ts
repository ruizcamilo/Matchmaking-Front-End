import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClanesSearchComponent } from './clanes-search.component';

describe('ClanesSearchComponent', () => {
  let component: ClanesSearchComponent;
  let fixture: ComponentFixture<ClanesSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClanesSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClanesSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
