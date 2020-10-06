import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoJuego } from 'src/app/model/video-juego';
import { VideoJuegoService } from '../../service/video-juego.service';

@Component({
  selector: 'app-videojuegos-search',
  templateUrl: './videojuegos-search.component.html',
  styleUrls: ['./videojuegos-search.component.css']
})
export class VideojuegosSearchComponent implements OnInit {

  search: string;
  videoJuegos: VideoJuego[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private videoJuegoService: VideoJuegoService,
  ) {}

  ngOnInit(): void {
    this.search = this.route.snapshot.paramMap.get("search");
    try {
      this.videoJuegoService.searchGameTitle(this.search).subscribe(
        (games: VideoJuego[]) => {
          this.videoJuegos = games;
        });
    } catch (error) {
      console.error(error);
    }
  }

  mostrarPublicaciones(): void
  {
    this.router.navigate(['/buscarPublicaciones',{ search: this.search } ])
  }

  mostrarUsuarios(): void {
    this.router.navigate(['/main-search', { search: this.search }]);
  }

}
