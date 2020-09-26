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
  confpassword: string;
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
  regions = [
    { label: 'Norteamerica', value: 1 },
    { label: 'Sudamerica', value: 2 },
    { label: 'Europa', value: 3 },
    { label: 'Asia', value: 4 },
    { label: 'Oceania', value: 5 },
    { label: 'Africa', value: 6 }
  ];
  juegosOpciones: string[] = [];
  juegosEscogidos: string[] = [];
  selectedRegion: string;
  userSend: User = new User("",0,0,"","","","","","","","",false);

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
    if (!this.userSend.correo || !this.userSend.contrasena) {
      alert('Falta llenar algunos campos requeridos');
    } else {
      this.userService.register(this.userSend).subscribe
      (async (result)=>{
        console.log(result);
        try {
          const result = await this.afAuth.signInWithEmailAndPassword(
            this.userSend.correo,
            this.userSend.contrasena
          );
          this.afAuth.idTokenResult.subscribe
            ((user) => {
              sessionStorage.setItem('token', user.token);
              this.userService.findByToken().subscribe
                ((user:User) => {
                sessionStorage.setItem('gamertag', user.nombre_usuario);
                this.router.navigate(['/profile']);
                });
            });
        } catch {
          alert('Error ingresando al nuevo perfil');
        }
      });
    }
  }
  searchGame() {
    this.juegosEscogidos.push(this.search);
    console.log(this.search);
    console.log(this.selectedRegion);
    //console.log(this.juegosEscogidos);
  }
}
