import { TestBed } from '@angular/core/testing';

import { GsapAnimationService } from './gsap-animation.service';

describe('GsapAnimationService', () => {
  let service: GsapAnimationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GsapAnimationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
