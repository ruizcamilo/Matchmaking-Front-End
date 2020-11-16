import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPostReportedComponent } from './admin-post-reported.component';

describe('AdminPostReportedComponent', () => {
  let component: AdminPostReportedComponent;
  let fixture: ComponentFixture<AdminPostReportedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPostReportedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPostReportedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
