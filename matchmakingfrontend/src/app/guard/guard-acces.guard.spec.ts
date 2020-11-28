import { TestBed } from '@angular/core/testing';

import { GuardAccesGuard } from './guard-acces.guard';

describe('GuardAccesGuard', () => {
  let guard: GuardAccesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GuardAccesGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
