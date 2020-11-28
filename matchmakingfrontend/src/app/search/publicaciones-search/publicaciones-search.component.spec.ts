import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicacionesSearchComponent } from './publicaciones-search.component';

describe('PublicacionesSearchComponent', () => {
  let component: PublicacionesSearchComponent;
  let fixture: ComponentFixture<PublicacionesSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicacionesSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicacionesSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
