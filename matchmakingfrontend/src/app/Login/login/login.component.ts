import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { User } from 'src/app/model/user';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  tokenName: string;
  errorMessage: string;
  eventMessage: string;
  done = false;

  constructor(
    private route: ActivatedRoute,
    private afAuth: AngularFireAuth,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {

  }

  async signIn() {
    if (!this.email || !this.password) {
      this.eventMessage = "Debe ingresar los campos.";
    } else {
      try {
        const result = await this.afAuth.signInWithEmailAndPassword(
          this.email,
          this.password
        );
        this.afAuth.idTokenResult.subscribe
          ((user) => {
            this.done = true;
            sessionStorage.setItem('token', user.token);
            this.userService.findByToken().subscribe
              ((user: User) => {
                sessionStorage.setItem('gamertag', user.nombre_usuario);
                sessionStorage.setItem('mail', user.correo);
                this.userService.isAdmin().subscribe(data => {
                  console.log(data);
                  if (data) {
                    sessionStorage.setItem('isAdmin', 'yes');
                  }
                  else {
                    sessionStorage.setItem('isAdmin', 'no');
                  }
                  this.router.navigate(['/feed']);
                });
              },
              (error) => {
                sessionStorage.clear();
                this.done = false;
                this.eventMessage = "Hubo un problema con el servidor. Refresque para intentar de nuevo.";
              });
          });
      } catch {
        this.eventMessage = "Hubo un problema de identificación. Revise los campos.";
      }
    }
  }
}
