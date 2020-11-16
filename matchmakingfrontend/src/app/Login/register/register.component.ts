import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/user.service';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { VideoJuegoService } from '../../service/video-juego.service';
import { VideoJuego } from 'src/app/model/video-juego';
import { Person } from 'src/app/model/person';
import { PersonService } from '../../service/person.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  prueba: boolean;
  fileToUpload: File = null;
  contrasena: string;
  confpassword: string;
  search: string;
  consolas = [
    { nombre: 'PS4', selected: false },
    { nombre: 'Xbox One', selected: false },
    { nombre: 'PC', selected: false },
  ];
  consolasEscogidas = [];
  juegos: VideoJuego[] = [
    { nombre: 'Call of Duty: Modern Warfare', imagen: '' },
    { nombre: 'Fortnite', imagen: '' },
    { nombre: 'Gears of War', imagen: '' },
    { nombre: 'Halo 4', imagen: '' },
    { nombre: 'CounterStrike', imagen: '' }
  ];
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
  juegosEscogidos: VideoJuego[] = [];
  selectedRegion: string;
  userSend: User = new User("", "", "", "", "", "", 0, "", "", false, []);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private afAuth: AngularFireAuth,
    private userService: UserService,
    private gameService: VideoJuegoService,
    private personService: PersonService
  ) { }

  ngOnInit(): void {
    //initConsoles();
    this.gameService.getAllGames().subscribe(allJuegos => this.juegos = allJuegos);
  }

  async register() {
    if (!this.userSend.correo || !this.contrasena) {
      alert('Falta llenar algunos campos requeridos');
    } else {
      this.userSend.plataformas = this.consolasEscogidas;
      this.afAuth.createUserWithEmailAndPassword(this.userSend.correo, this.contrasena).then(() => this.userSuccess()
      ).catch(function (error) {
        alert('Error ingresando el nuevo perfil ' + error);
      });
    }
  }

  userSuccess() {
    console.log("Entro");
    this.afAuth.idTokenResult.subscribe((user) => {
      sessionStorage.setItem('token', user.token);
      this.userService.findByToken().subscribe((user: User) => {
        if (this.fileToUpload != null) {
          const uploadImageData = new FormData();
          uploadImageData.append('file', this.fileToUpload);
          uploadImageData.append('folder', 'Fotosperfil/');
          this.userService.uploadFile(uploadImageData).subscribe(name => {
            this.userSend.foto_perfil = name;
            this.userService.register(this.userSend)
              .subscribe(data => { this.personService.setFavorites(this.juegosEscogidos).subscribe(); });
          }, error => {
            console.log(error);
          });
        }
        else {
          this.userService.register(this.userSend)
            .subscribe(data => { this.personService.setFavorites(this.juegosEscogidos).subscribe(); });
        }
        sessionStorage.setItem('gamertag', this.userSend.nombre_usuario);
        sessionStorage.setItem('mail', this.userSend.correo);
        this.router.navigate(['/feed']);
      });
    });
  }


  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
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

  gameSelection(juego) {
    if (this.juegosEscogidos.includes(juego)) {
      this.juegosEscogidos.splice(this.juegosEscogidos.indexOf(juego), 1);
    }
    else {
      this.juegosEscogidos.push(juego);
    }
  }
}
