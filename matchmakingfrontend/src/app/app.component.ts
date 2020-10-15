import { Component, DoCheck } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Person } from './model/person';
import { PersonService } from './service/person.service';
import { UserService } from './service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements DoCheck{
  gamerTag: string = "StormyFiddle";
  title = 'matchmakingfrontend';
  search: string;
  show: boolean;
  solicitudes: Person[] = [];

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private personService: PersonService,
    private userService: UserService
    ) {
  }

  ngDoCheck(): void {
    //Called every time that the input properties of a component or a directive are checked. Use it to extend change detection by performing a custom check.
    //Add 'implements DoCheck' to the class.
    if (sessionStorage.getItem("gamertag") === null)
    {
      this.show = false;
    }else{
      this.gamerTag = sessionStorage.getItem("gamertag");
      this.show = true;
    }
  }

  getNotificaciones(){
    this.personService.getFriendRequestsNotifications().subscribe(
      (friNotif: Person[]) =>  {
        this.solicitudes = friNotif;
        console.log(this.solicitudes);
    });
  }

  aceptar(mail){
    this.userService.acceptFriendById(mail).subscribe();
  }

  rechazar(mail){
    this.userService.rejectFriendById(mail).subscribe();
  }

  logout() {
    this.afAuth.signOut();
    sessionStorage.clear();
  }

  goSearch(){
    if (!this.search)
    {
      alert("Ingresa algo noob");
    }
    else{
      this.router.navigate(['/main-search', { search: this.search }]);
    }
  }
}
