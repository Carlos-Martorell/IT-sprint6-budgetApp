import { TestBed } from '@angular/core/testing';

import { FormUrlSync } from './form-url-sync';

describe('FormUrlSync', () => {
  let service: FormUrlSync;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormUrlSync);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
