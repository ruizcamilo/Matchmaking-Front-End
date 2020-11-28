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
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  prueba: boolean;
  errorContra = false;
  errorConex = false;
  errorFecha = false;
  errorMail = false;
  errorMessage: string[] = [];
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
    private personService: PersonService,
    private storage: AngularFireStorage
  ) { }

  ngOnInit(): void {
    this.gameService.getAllGames().subscribe(allJuegos => this.juegos = allJuegos);
  }

  async register() {
    this.errorContra = false; this.errorConex=false; this.errorFecha = false;
    let newDate = new Date(this.userSend.fecha_nacimiento);
    let todayDate = new Date();
    let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (!this.userSend.correo || !this.contrasena) {
      this.errorMessage.push('Falta llenar algunos campos requeridos');
    }
    if (!regexp.test(this.userSend.correo))
    {
      this.errorMessage.push('Ese no es un mail valido');
      this.errorMail = true;
    }
    if (this.confpassword != this.contrasena){
      this.errorMessage.push('La contraseña no concuerda');
      this.errorContra = true;
    }
    if (this.userSend.conexion <= 0){
      this.errorMessage.push('La conexion no puede ser negativa');
      this.errorConex = true;
    }
    if (newDate > todayDate)
    {
      this.errorMessage.push('La fecha que ingresaste es en el futuro');
      this.errorFecha = true;
    }
    if (this.errorMessage.length == 0){
      this.userSend.plataformas = this.consolasEscogidas;
      this.afAuth.createUserWithEmailAndPassword(this.userSend.correo, this.contrasena).then(() => this.userSuccess()
      ).catch(
        function (error) {
          alert('Error ingresando el nuevo perfil ' + error);
        }
      );
    }
  }

  userSuccess() {
    this.afAuth.idTokenResult.subscribe((user) => {
      sessionStorage.setItem('token', user.token);
      this.userService.findByToken().subscribe((user: User) => {
        if (this.fileToUpload != null) {
          let name = `Fotosperfil/`+Date.now()+"-"+this.fileToUpload.name;
          this.storage.upload(name, this.fileToUpload);
          this.userSend.foto_perfil = name;
          this.userService.register(this.userSend)
            .subscribe(data => {
              this.personService.setFavorites(this.juegosEscogidos).subscribe(()=>{
                sessionStorage.setItem('gamertag', this.userSend.nombre_usuario);
                sessionStorage.setItem('mail', this.userSend.correo);
                sessionStorage.setItem('isAdmin', 'no');
                this.router.navigate(['/feed']);
              });
          });
        }
        else {
          this.userService.register(this.userSend).subscribe(data => {
            this.personService.setFavorites(this.juegosEscogidos).subscribe(() => {
              sessionStorage.setItem('gamertag', this.userSend.nombre_usuario);
              sessionStorage.setItem('mail', this.userSend.correo);
              sessionStorage.setItem('isAdmin', 'no');
              this.router.navigate(['/feed']);
            });
          });
        }
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
