import { TestBed } from '@angular/core/testing';

import { VideoJuegoService } from './video-juego.service';

describe('VideoJuegoService', () => {
  let service: VideoJuegoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoJuegoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
