import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  tokenName: string;
  valido: boolean;

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
        console.log('sapo soble');
        alert('sapo doble');
        const result = await this.afAuth.signInWithEmailAndPassword(
          this.email,
          this.password
        );
        this.afAuth.idTokenResult.subscribe
          ((user) => {
            this.tokenName = 'X-Firebase-Auth';
            this.userService.login(user.token, this.tokenName);
          });
      } catch {
        alert('error');
      }
    }
  }
}
