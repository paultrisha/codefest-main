import { TestBed } from '@angular/core/testing';

import { WebexService } from './webex.service';

describe('WebexService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebexService = TestBed.get(WebexService);
    expect(service).toBeTruthy();
  });
});
