import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/user.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-main-search',
  templateUrl: './main-search.component.html',
  styleUrls: ['./main-search.component.css']
})
export class MainSearchComponent implements OnInit {

  search: string;
  usuarios: any[] = [];
  yo: string;
  done = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private sanitizer: DomSanitizer
  ){
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }


  ngOnInit(): void {
    this.yo = sessionStorage.getItem('gamertag');
    this.search = this.route.snapshot.paramMap.get('search');
    try {
      this.userService.searchUser(this.search).subscribe(
        (users: User[]) => {
          for (const us of users) {
            this.userService.downloadFile(us.foto_perfil).subscribe(data => {
              let objectURL = 'data:image/png;base64,' + data;
              let imagen = this.sanitizer.bypassSecurityTrustUrl(objectURL);
              this.usuarios.push([us,imagen]);
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
    this.router.navigate(['/publication-search', { search: this.search } ]);
  }

  mostrarVideoJuegos(): void
  {
    this.router.navigate(['/videogame-search', { search: this.search } ]);
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
