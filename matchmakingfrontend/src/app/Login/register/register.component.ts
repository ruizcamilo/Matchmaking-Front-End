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
  fileToUpload: File = null;
  contrasena: string;
  confpassword: string;
  search: string;
  consolas = [
    {nombre: 'PS4', selected: false},
    {nombre: 'Xbox One', selected: false},
    {nombre: 'PC', selected: false},
  ];
  consolasEscogidas = [];
  juegos: string[] = [
    'Call of Duty: Modern Warfare',
    'Fortnite',
    'Gears of War',
    'Halo 4',
    'CounterStrike',
  ];
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
  juegosOpciones: string[] = [];
  juegosEscogidos: string[] = [];
  selectedRegion: string;
  userSend: User = new User("","","","","","",0,"","",false,[]);

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
    if (!this.userSend.correo || !this.contrasena) {
      alert('Falta llenar algunos campos requeridos');
    } else {
      console.log(this.userSend);
      console.log(this.consolasEscogidas);
      this.afAuth.createUserWithEmailAndPassword(this.userSend.correo, this.contrasena).then(function(){
        console.log("Entro");
        this.userService.register(this.userSend); //Hay error en esta línea, el userService aparentemente esta undefined
        this.afAuth.idTokenResult.subscribe
            ((user) => {
              sessionStorage.setItem('token', user.token);
              this.userService.findByToken().subscribe((user: User) => {
                const uploadImageData = new FormData();
                uploadImageData.append('file', this.fileToUpload);
                uploadImageData.append('folder', 'Fotosperfil/');
                this.userService.uploadFile(uploadImageData).subscribe(name => {
                  this.userSend.foto_perfil = name;
                  this.userService.updateUser(this.userSend).subscribe(data => {
                    // do something, if upload success
                    }, error => {
                      console.log(error);
                    });
                });
                sessionStorage.setItem('gamertag', user.nombre_usuario);
                this.router.navigate(['/profile']);
                });
            });
      }).catch(function(error){
        alert('Error ingresando al nuevo perfil ' + error);
      });
    }
      /*  try {
          const result = await this.afAuth.createUserWithEmailAndPassword(
            this.userSend.correo,
            this.contrasena
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
        }*/
    }
  searchGame() {
    this.juegosEscogidos.push(this.search);
    console.log(this.search);
    console.log(this.selectedRegion);
    //console.log(this.juegosEscogidos);
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  checked(nombre){
    if (this.consolasEscogidas.indexOf(nombre) != -1)
    {
      return true;
    }
  }


  changeStatus(checked, nombre)
  {
    if (checked)
    {
      this.consolasEscogidas.push(nombre);
    } else {
      let i = this.consolasEscogidas.indexOf(nombre);
      this.consolasEscogidas.splice(i, 1);
    }
  }
}
