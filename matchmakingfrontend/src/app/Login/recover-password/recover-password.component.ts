import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent implements OnInit {

  emailAddress: string;
  constructor(
    private route: ActivatedRoute,
    private afAuth: AngularFireAuth,
    private router: Router) { }

  ngOnInit(): void {
  }

  recoverPassword(){
    this.afAuth.sendPasswordResetEmail(this.emailAddress).then(function() {
      console.log("email sent");
    }).catch(function(error) {
      // An error happened.
    });
  }
}
