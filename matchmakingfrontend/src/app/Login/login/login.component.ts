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

  constructor(
    private route: ActivatedRoute,
    private afAuth: AngularFireAuth,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {

  }

  async signIn() {
    if (!this.email || !this.password) {
      alert('error');
    } else {
      try {
        const result = await this.afAuth.signInWithEmailAndPassword(
          this.email,
          this.password
        );
        this.afAuth.idTokenResult.subscribe
          ((user) => {
            sessionStorage.setItem('token', user.token);
            this.userService.findByToken().subscribe
              ((user: User) => {
              sessionStorage.setItem('gamertag', user.nombre_usuario);
              this.router.navigate(['/feed']);
              });
          });
      } catch {
        alert('Error en la autentificación');
      }
    }
  }
}
