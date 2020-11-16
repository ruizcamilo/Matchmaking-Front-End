import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUsersReportedComponent } from './admin-users-reported.component';

describe('AdminUsersReportedComponent', () => {
  let component: AdminUsersReportedComponent;
  let fixture: ComponentFixture<AdminUsersReportedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUsersReportedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUsersReportedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
