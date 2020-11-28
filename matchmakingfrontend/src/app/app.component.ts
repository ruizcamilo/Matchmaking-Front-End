import { Component, DoCheck, ElementRef } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Person } from './model/person';
import { PersonService } from './service/person.service';
import { UserService } from './service/user.service';
import { SquadInvitation } from './model/squad-invitation';
import { SquadService } from 'src/app/service/squad.service';
import { Squad } from './model/squad';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements DoCheck{
  gamerTag: string = 'StormyFiddle';
  title = 'matchmakingfrontend';
  search: string;
  show: boolean;
  admin: string;
  solicitudes: any[] = [];

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private personService: PersonService,
    private userService: UserService,
    private elementRef: ElementRef,
    private squadService: SquadService
    ) {
  }

  ngDoCheck(): void {
    //Called every time that the input properties of a component or a directive are checked. Use it to extend change detection by performing a custom check.
    //Add 'implements DoCheck' to the class.
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#0e141e';
    if (sessionStorage.getItem("gamertag") === null)
    {
      this.show = false;
    }else{
      this.gamerTag = sessionStorage.getItem("gamertag");
      this.admin = sessionStorage.getItem("isAdmin");
      this.show = true;
    }
  }

  getNotificaciones(){
    this.solicitudes = [];
    this.personService.getFriendRequestsNotifications().subscribe(
      (friNotif: Person[]) =>  {
        for (const notif of friNotif) {
          this.solicitudes.push([notif, 'friend']);
        }
        console.log(this.solicitudes);
    });
    this.personService.getSquadInvitations().subscribe(
      (squadNotif: SquadInvitation[]) =>  {
        for (const notif of squadNotif) {
          this.solicitudes.push([notif, 'squad']);
        }
        console.log(squadNotif);
    });
  }

  aceptarFriend(mail){
    this.userService.acceptFriendById(mail).subscribe();
  }

  rechazarFriend(mail){
    this.userService.rejectFriendById(mail).subscribe();
  }

  aceptarSquad(invitation){
    this.squadService.acceptSquad(invitation).subscribe(bool => {
      if (bool)
      {
        this.router.navigate(['squad-view', { squadid: invitation.idSquad }]);
      }else{
        alert('No se ha podido unir');
      }
    });
  }

  rechazarSquad(invitation){
    this.squadService.rejectSquad(invitation).subscribe();
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
