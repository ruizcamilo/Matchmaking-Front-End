import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { async } from 'rxjs/internal/scheduler/async';
import { Clan } from 'src/app/model/clan';
import { User } from 'src/app/model/user';
import { ClanService } from 'src/app/service/clan.service';
import { UserService } from 'src/app/service/user.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-clanes-search',
  templateUrl: './clanes-search.component.html',
  styleUrls: ['./clanes-search.component.css'],
})
export class ClanesSearchComponent implements OnInit {
  search: string;
  usuarios: User[] = [];
  clanes: Clan[] = [];
  myClans: Clan[] = [];
  searchClanes = [];
  isMember: boolean;
  isRequestSend: boolean[];
  yo: string;
  done = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clanService: ClanService,
    private sanitizer: DomSanitizer,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.yo = sessionStorage.getItem('gamertag');
    this.search = this.route.snapshot.paramMap.get('search');
    try {
      this.getClans();
    } catch (error) {
      console.error(error);
    }
  }
  async getClans() {
    this.clanService.searchClan(this.search).subscribe(async (clans: Clan[]) => {
      this.clanes = clans;
      for (let index = 0; index < clans.length; index++) {
        let nombre_clan = clans[index].nombre_clan;
        let descripcion = clans[index].descripcion;

        this.clanService.isRequestSend(nombre_clan).subscribe(async (vars) => {
          let isRequest: boolean;
          if (vars)
            isRequest = true;
          else
            isRequest = false;

          if (clans[index].foto_clan != '') {
            await this.userService.downloadFile(clans[index].foto_clan).toPromise().then(async data => {
              let objectURL = 'data:image/png;base64,' + data;
              let fotoperfil = this.sanitizer.bypassSecurityTrustUrl(objectURL);
              this.searchClanes.push([nombre_clan, descripcion, fotoperfil, isRequest]);
            });
          } else {
            this.searchClanes.push([nombre_clan, descripcion, null, isRequest]);
          }
        });
      }
      this.soyMiembro();
    });
  }

  mostrarUsuarios(): void {
    this.router.navigate(['/main-search', { search: this.search }]);
  }

  mostrarPublicaciones(): void {
    this.router.navigate(['/publication-search', { search: this.search }]);
  }

  mostrarVideoJuegos(): void {
    this.router.navigate(['/videogame-search', { search: this.search }]);
  }

  mostrarSquads(): void {
    this.router.navigate(['/squad-search', { search: this.search }]);
  }

  async soyMiembro() {
    for (let i = 0; i < this.clanes.length; i++) {
      this.clanService
        .isMember(this.clanes[i].nombre_clan)
        .subscribe(async (esMiembro) => {
          if (esMiembro) {
            this.myClans.push(this.clanes[i]);
          }
        });
      this.done = true;
    }
  }

  soyMiembro2(Clan: string): boolean {
    this.isMember = false;
    for (let index = 0; index < this.myClans.length; index++) {
      if (Clan == this.myClans[index].nombre_clan) {
        this.isMember = true;
        return this.isMember;
      }
    }
    return this.isMember;
  }

  joinClan(nombre_clan: string) {
    this.clanService.requestToClan(nombre_clan).subscribe((vars) => { });
    console.log(nombre_clan);
  }

  routingClan(nombre_clan: string) {
    let ruta: string = '/clans/' + nombre_clan;
    this.router.navigate([ruta]);
  }

  async SolicitudEnviada(Clan: string): Promise<boolean> {
    let varRetornar: boolean;
    this.clanService.isRequestSend(Clan).subscribe(async (vars) => {
      if (vars) {
        varRetornar = true;
      }
      else {
        varRetornar = false;
      }
    });
    return varRetornar;
  }
}

