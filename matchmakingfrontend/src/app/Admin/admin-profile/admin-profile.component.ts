import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from 'src/app/service/post.service';
import { Post } from 'src/app/model/post';
import { PersonService } from 'src/app/service/person.service';
import { Person } from 'src/app/model/person';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css'],
})
export class AdminProfileComponent implements OnInit {
  postsReported: Post[] = [];
  usuariosReported: Person[] = [];
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private postService: PostService,
    private personService: PersonService,
    ) { }
    
    ngOnInit(): void {
      try {
        this.postService.getPostsReported().subscribe((posts: Post[]) => {
          this.postsReported = posts;
        });
        
        this.personService.getUsersResported().subscribe((userReported: Person[]) => {
          this.usuariosReported = userReported;
      });
    } catch (error) {
      console.error(error);
    }
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
  
  routingFeedAdmin():void {
    window.location.reload();
  }
  
  routingProfile(userID: string) {
    let ruta: string = "/profile/" + userID;
    this.router.navigate([ruta]);
  }
 
}
