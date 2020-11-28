import { TestBed } from '@angular/core/testing';

import { NewAccessGuardGuard } from './new-access-guard.guard';

describe('NewAccessGuardGuard', () => {
  let guard: NewAccessGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NewAccessGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
