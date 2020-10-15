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
  videoJuegos: VideoJuego[] = [
    {nombre:"Halo The Master Chief Collection", imagen:"https://compass-ssl.xbox.com/assets/92/5d/925d1321-89fe-4537-9303-a64adaf27c07.jpg?n=Halo-MCC_GLP-Page-Hero-1084_1920x1040.jpg"},
    {nombre:"Assassins Creed Revelations" ,imagen: "https://ubistatic19-a.akamaihd.net/ubicomstatic/es-mx/global/game-info/acr_nakedbox_mobile_165287.jpg"}
  ];

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
    this.router.navigate(['publication-search',{ search: this.search } ])
  }

  mostrarUsuarios(): void {
    this.router.navigate(['/main-search', { search: this.search }]);
  }

  mostrarClanes(): void
  {
    this.router.navigate(['/clan-search', { search: this.search } ]);
  }

  mostrarSquads(): void
  {
    this.router.navigate(['/squad-search', { search: this.search } ]);
  }

}
