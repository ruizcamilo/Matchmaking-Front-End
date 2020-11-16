import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from 'src/app/service/post.service';
import { UserService } from 'src/app/service/user.service';
import { PersonService } from 'src/app/service/person.service';
import { Person } from 'src/app/model/person';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-users-reported',
  templateUrl: './admin-users-reported.component.html',
  styleUrls: ['./admin-users-reported.component.css']
})
export class AdminUsersReportedComponent implements OnInit {

  usuariosReported: Person[] = [];
  users = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private personService: PersonService,
    private sanitizer: DomSanitizer,) { }

  ngOnInit(): void {
    try {
      this.getUsers();
    } catch (error) {
      console.error(error);
    }
  }
  async getUsers() {
    await this.personService.getUsersResported().subscribe(async (userReported: Person[]) => {
      this.usuariosReported = userReported;
      for (let index = 0; index < userReported.length; index++) {
        let nombre_usuario = userReported[index].nombre_usuario;
        console.log("------------------------------------------" + nombre_usuario);
        
        await this.userService.downloadFile(userReported[index].foto_perfil).toPromise().then(async data => {
          let objectURL = 'data:image/png;base64,' + data;
          let fotoperfil = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          this.users.push([nombre_usuario, fotoperfil]);
        });
      }
    });
  }

  mostrarUsuariosReportados(): void
  {
    this.router.navigate(['/userReported']);
  }
  mostrarPublicacionesReportadas(): void
  {
    this.router.navigate(['/postReported']);
  }
  mostrarVideoJuegosAdmin(): void
  {
    this.router.navigate(['/videoGames']);
  }

  routingProfile(userID: string) {
    let ruta: string = "/profile/" + userID;
    this.router.navigate([ruta]);
  }

  UserDelete(id: string): void {
    this.route.params.subscribe(params => {
      try {
        this.personService.deleteUserById(id).subscribe(data => {
        }, error => {
          console.log(error);
        });;
      } catch (error) {
        alert("Error en la base de datos");
      }
    });
    this.routingFeedAdmin();
  }

  UserDiscard(id: string): void {
    this.route.params.subscribe(params => {
      try {
        this.personService.discardDeleteUserById(id).subscribe(data => {
        }, error => {
          console.log(error);
        });;
      } catch (error) {
        alert("Error en la base de datos");
      }
    });
    this.routingFeedAdmin();
  }

  routingFeedAdmin(): void {
    window.location.reload();
  }

}
