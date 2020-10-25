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

  UserDelete(id:string ): void {
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

  UserDiscard(id:string): void {
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
  routingFeedAdmin():void {
    window.location.reload();
  }

  deletePost(id:string): void{
    console.log(id);
    this.route.params.subscribe(params => {
      try {
        this.postService.deletePostById(id).subscribe(data => {
          }, error => {
            console.log(error);
          });;
      } catch (error) {
        alert("Error en la base de datos");
      }
    });
    this.routingFeedAdmin();

  }

  discardDeletePost(id:string): void{
    console.log(id);
    this.route.params.subscribe(params => {
      try {
        this.postService.discardDeletePostById(id).subscribe(data => {
          }, error => {
            console.log(error);
          });;
      } catch (error) {
        alert("Error en la base de datos");
      }
    });
    this.routingFeedAdmin();

  }

  routingProfile(userID: string) {
    let ruta: string = "/profile/" + userID;
    this.router.navigate([ruta]);
  }

}
