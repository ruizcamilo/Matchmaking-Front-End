import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { VideoJuego } from 'src/app/model/video-juego';
import { MatchmakingService } from 'src/app/service/matchmaking.service';
import { UserService } from 'src/app/service/user.service';
import { Matchmaking } from '../../model/matchmaking';
import { VideoJuegoService } from '../../service/video-juego.service';
import { Person } from 'src/app/model/person';
import { User } from 'src/app/model/user';
import { PersonService } from '../../service/person.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-matchmaking',
  templateUrl: './matchmaking.component.html',
  styleUrls: ['./matchmaking.component.css']
})
export class MatchmakingComponent implements OnInit {
  Owner: User;
  search: string;
  matchFilters: Matchmaking = new Matchmaking(null, null, '', null);
  resultados: any[] = [];
  region: string;
  juegos: any[] = [];
  selectedJuegos: string[] = [];
  consolasEscogidas: string[] = [];
  anchoNumero = 0;
  anchoResult = 0;
  pressed = false;
  regions = [
    'Brasil',
    'Europa Nórdica y Este',
    'Europa Oeste',
    'Japón',
    'Latinoamérica Norte',
    'Latinoamérica Sur',
    'Norteamérica',
    'Oceanía',
    'República de Corea',
    'Rusia',
    'Turquia'
  ];

  consolas = [
    { nombre: 'PS4', selected: false },
    { nombre: 'Xbox One', selected: false },
    { nombre: 'PC', selected: false },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchmakingService: MatchmakingService,
    private userService: UserService,
    private gameService: VideoJuegoService,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.matchmakingService.delete().subscribe();
    this.gameService.getAllGames().subscribe(allJuegos => {
          console.log(allJuegos);
          for (let index = 0; index < allJuegos.length; index++) {
            this.userService.downloadFile(allJuegos[index].imagen).subscribe(data => {
              let objectURL = 'data:image/png;base64,' + data;
              let imagen = this.sanitizer.bypassSecurityTrustUrl(objectURL);
              this.juegos.push([allJuegos[index], imagen]);
              this.anchoNumero += 160;
          });
        }
      });
    }

  ngOnDestroy(): void{
    if (this.pressed)
    {
      this.matchmakingService.delete().subscribe();
    }
  }

  clickGame(juego:VideoJuego)
  {
    if (this.selectedJuegos.includes(juego.nombre)) {
      this.selectedJuegos.splice(this.selectedJuegos.indexOf(juego.nombre), 1);
    }
    else {
      this.selectedJuegos.push(juego.nombre);
    }
    //console.log(this.selectedJuegos);
  }

  changeStatus(nombre) {
    for (let seleccionada of this.consolas) {
      if (seleccionada.nombre == nombre) {
        if (seleccionada.selected) {
          seleccionada.selected = false;
          this.consolasEscogidas.splice(this.consolasEscogidas.indexOf(nombre), 1);
        } else {
          seleccionada.selected = true;
          this.consolasEscogidas.push(nombre);
        }
      }
    }
  }

  isSelected(juego:VideoJuego) {
    let existe = false;
    for (let jueguin of this.selectedJuegos)
    {
      if (juego.nombre == jueguin)
      {
        existe = true;
      }
    }
    return existe;
    }

  imprimir(){
    console.log(this.anchoNumero);
    console.log(this.selectedJuegos);
  }

  goChatByMail(mail: string)
  {
    this.router.navigate(['chat', { mail: mail }]);
  }

  buscar(){
    if(this.pressed)
    {
      this.match();
    }
    else{
    this.pressed = true;
    this.matchFilters.juegos = this.selectedJuegos;
    this.matchFilters.plataformas = this.consolasEscogidas;
    this.matchFilters.region = this.region;
    this.matchmakingService.create(this.matchFilters).subscribe();
    this.matchmakingService.match(this.matchFilters).subscribe(matchs => {
      console.log(matchs);
      for (let index = 0; index < matchs.length; index++) {
        this.userService.downloadFile(matchs[index].person.foto_perfil).subscribe(data => {
          let objectURL = 'data:image/png;base64,' + data;
          let imagen = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          this.resultados.push([matchs[index], imagen]);
          this.anchoResult += 270;
        });
      }
    });
    }
  }

  match(){
    this.resultados = [];
    this.anchoResult = 0;
    this.matchFilters.juegos = this.selectedJuegos;
    this.matchFilters.plataformas = this.consolasEscogidas;
    this.matchFilters.region = this.region;
    this.matchmakingService.match(this.matchFilters).subscribe(matchs => {
      console.log(matchs);
      for (let index = 0; index < matchs.length; index++) {
        this.userService.downloadFile(matchs[index].person.foto_perfil).subscribe(data => {
          let objectURL = 'data:image/png;base64,' + data;
          let imagen = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          this.resultados.push([matchs[index], imagen]);
          this.anchoResult += 270;
        });
      }
    });
  }
}
