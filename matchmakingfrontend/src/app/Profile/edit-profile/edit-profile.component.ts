import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoJuegoService } from '../../service/video-juego.service';
import { VideoJuego } from 'src/app/model/video-juego';
import { PersonService } from 'src/app/service/person.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  fileToUpload: File = null;
  search: string;
  consolas = [
    { nombre: 'PS4', selected: false },
    { nombre: 'Xbox One', selected: false },
    { nombre: 'PC', selected: false },
  ];
  consolasEscogidas = [];
  juegos: VideoJuego[] = [];
  regions = [
    "Brasil",
    "Europa Nórdica y Este",
    "Europa Oeste",
    "Japón",
    "Latinoamérica Norte",
    "Latinoamérica Sur",
    "Norteamérica",
    "Oceanía",
    "República de Corea",
    "Rusia",
    "Turquia"
  ];
  juegosEscogidos: VideoJuego[] = [];
  selectedRegion: string;
  userSend: User = new User("","","","","","",0,"","",false,[]);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private gameService: VideoJuegoService,
    private personService: PersonService
  ) {}

  ngOnInit(): void {
    this.gameService.getAllGames().subscribe(allJuegos => {this.juegos = allJuegos;});
    this.userService.findByToken().subscribe
    ((user: User) => {
      this.userSend = user;
      console.log(this.userSend.region_id);
      this.personService.getFavorites(user.correo).subscribe(data =>
        {
          this.juegosEscogidos = data;
          console.log(this.juegosEscogidos);
          console.log(this.juegos);
        });
      this.markConsoles();
    });
  }

  markConsoles(){
    for (const plata of this.userSend.plataformas) {
      for (let index = 0; index < this.consolas.length; index++) {
        if (this.consolas[index].nombre == plata)
        {
          this.consolas[index].selected = true;
          this.consolasEscogidas.push(plata);
        }
      }
    }
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

  async update() {
    this.userSend.plataformas = this.consolasEscogidas;
    var uploadImageData = new FormData();
    uploadImageData.append('file', this.fileToUpload);
    uploadImageData.append('folder', 'Fotosperfil/');
    this.userSend.foto_perfil = 'Fotosperfil/' + this.fileToUpload;
    this.userService.uploadFile(uploadImageData).subscribe(name => {
      this.userSend.foto_perfil = name;
      this.userService.updateUser(this.userSend).subscribe(data => {
        this.personService.setFavorites(this.juegosEscogidos).subscribe();
        this.router.navigate(['/profile']);
        }, error => {
          console.log(error);
        });
      }, error => {
        console.log(error);
      });
  }

  gameSelection(juego) {
    if (this.juegosEscogidos.includes(juego)) {
      this.juegosEscogidos.splice(this.juegosEscogidos.indexOf(juego), 1);
    }
    else {
      this.juegosEscogidos.push(juego);
    }
    console.log(this.juegosEscogidos);
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  juegoExiste(juego:VideoJuego) {
    let existe = false;
    for (let jueguin of this.juegosEscogidos)
    {
      if (juego.nombre == jueguin.nombre)
      {
        existe = true;
      }
    }
    return existe;
    }
}
