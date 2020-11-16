import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from 'src/app/service/post.service';
import { UserService } from 'src/app/service/user.service';
import { Post } from 'src/app/model/post';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-admin-post-reported',
  templateUrl: './admin-post-reported.component.html',
  styleUrls: ['./admin-post-reported.component.css']
})
export class AdminPostReportedComponent implements OnInit {
  postsReported: Post[] = [];
  publications = [];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private postService: PostService,
    private userService: UserService,
    private sanitizer: DomSanitizer,) { }

  ngOnInit(): void {
    try {
      this.getPublicaciones();
    } catch (error) {
      console.error(error);
    }
  }
  async getPublicaciones() {
    await this.postService.getPostsReported().subscribe(async (posts: Post[]) => {
      this.postsReported = posts;
      console.log("hekpssss " +  posts.length);
      for (let index = 0; index < posts.length; index++) {
        let id = posts[index].id;
        let nombre_usuario = posts[index].person.nombre_usuario;
        let content = posts[index].contenido;
        let fecha = posts[index].fecha;
        await this.userService.downloadFile(posts[index].person.foto_perfil).toPromise().then(async data => {
          let objectURL = 'data:image/png;base64,' + data;
          let fotoperfil = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          if (posts[index].imagen != '')
          {
            await this.userService.downloadFile(posts[index].imagen).toPromise().then(data1 => {
              let objectURL1 = 'data:image/png;base64,' + data1;
              let fotoadicional = this.sanitizer.bypassSecurityTrustUrl(objectURL1);
              this.publications.push([nombre_usuario, content, fecha, fotoperfil, fotoadicional, id]);
            });
          }else{
            this.publications.push([nombre_usuario, content, fecha, fotoperfil, null, id]);
          }
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

  routingFeedAdmin(): void {
    //window.location.reload();
  }

  deletePost(id:string): void{
    console.log(id);
    console.log("HWLPPPPPPP");
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
