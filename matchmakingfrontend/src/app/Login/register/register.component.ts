import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  email: string;
  password: string;
  confpassword: string;
  gamertag: string;
  date: string;
  nombre: string;
  search: string;
  consolas: string[] = [
    'Playstation 4',
    'Xbox One',
    'PC',
    'Xbox 360',
    'PlayStation 3',
  ];
  juegos: string[] = [
    'Call of Duty: Modern Warfare',
    'Fortnite',
    'Gears of War',
    'Halo 4',
    'CounterStrike',
  ];
  juegosOpciones: string[] = [];
  juegosEscogidos: string[] = [];
  userSend: User;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private afAuth: AngularFireAuth,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    //initConsoles();
    //initGameList();
  }

  async register() {
    if (!this.email || !this.password) {
      alert('error');
    } else {
      this.userSend.correo = this.email;
      this.userSend.contrasena = this.password;
      this.userSend.fecha_nacimiento = this.date;
      this.userSend.nombres = this.nombre;
      this.userService.register(this.userSend);
      /*try {
        const result = await this.afAuth.createUserWithEmailAndPassword(
          this.email,
          this.password
        );
        console.log(
          this.afAuth.idTokenResult.subscribe((user) => {
            alert(user.token);
          })
        );
        alert(this.afAuth.idTokenResult);
        return result;
      } catch {
        alert('error');
      }*/
    }
  }
  searchGame() {
    this.juegosEscogidos.push(this.search);
    console.log(this.search);
    console.log(this.email);
    //console.log(this.juegosEscogidos);
  }
}
