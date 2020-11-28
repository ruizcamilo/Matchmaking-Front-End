import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoJuego } from 'src/app/model/video-juego';
import { VideoJuegoService } from '../../service/video-juego.service';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-videojuegos-search',
  templateUrl: './videojuegos-search.component.html',
  styleUrls: ['./videojuegos-search.component.css']
})
export class VideojuegosSearchComponent implements OnInit {

  search: string;
  videoJuegos: any[] = [ ];
  done = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private videoJuegoService: VideoJuegoService,
    private sanitizer: DomSanitizer,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.search = this.route.snapshot.paramMap.get('search');
    try {
      this.videoJuegoService.searchGameTitle(this.search).subscribe(
        (games: VideoJuego[]) => {
          for (const us of games) {
            this.userService.downloadFile(us.imagen).subscribe(data => {
              let objectURL = 'data:image/png;base64,' + data;
              let imagen = this.sanitizer.bypassSecurityTrustUrl(objectURL);
              this.videoJuegos.push([us, imagen]);
            });
          }
          this.done = true;
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
