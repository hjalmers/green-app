import { TestBed } from '@angular/core/testing';

import { KycFormService } from './kyc-form.service';

describe('KycFormService', () => {
  let service: KycFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KycFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
