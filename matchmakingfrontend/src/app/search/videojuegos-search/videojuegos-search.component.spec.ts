import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideojuegosSearchComponent } from './videojuegos-search.component';

describe('VideojuegosSearchComponent', () => {
  let component: VideojuegosSearchComponent;
  let fixture: ComponentFixture<VideojuegosSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideojuegosSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideojuegosSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
