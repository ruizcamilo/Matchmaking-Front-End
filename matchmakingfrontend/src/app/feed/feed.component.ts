import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Post } from 'src/app/model/post';
import { PostService } from 'src/app/service/post.service'
import { PersonService } from 'src/app/service/person.service'
import { Person } from '../model/person';
import { UserService } from '../service/user.service';
import { Comment } from '../model/comment';
import { User } from '../model/user';


@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  likes: number;
  comment: Comment = new Comment('', null, '', '');
  comments: string[] = [];
  showPub: Post = new Post(new Person('', '', ''), '', '', '', false);
  pubComments: Comment[] = [];
  profilepic: any;
  Owner: User;
  fileToUpload: File = null;
  post: Post = new Post(null, "", "", "", false);
  publications = [];
  MyfriendsPlaying: Person[] = [];
  MyfriendsChating: Person[] = [];
  personaPrueba:Person;
  pruebaPost:Post;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private postService: PostService,
    private personService: PersonService,
    private userService: UserService,
    private sanitizer: DomSanitizer
  ) { }


  ngOnInit(): void {
       try {
        //amigos jugando
        this.personService.getActiveFriends().subscribe(
           (personas: Person[]) => {
            this.MyfriendsPlaying = personas;
           });
        //amigos chateando
        this.personService.getFriendsChat().subscribe(
           (chating: Person[]) => {
            this.MyfriendsChating = chating;
           });
        //Feed
        this.getProfile();
      } catch (error) {
        console.error(error);
      }
  }
  async darMeGusta(idPost: string){
    this.postService.like(idPost).subscribe(data =>{
      this.postService.getLikes(idPost).subscribe(thoselikes => this.likes = thoselikes);
    }, error => console.log(error)
  );
  }

  async makeComment(idPost: string){
    this.comment.publicacion_id = idPost;
    this.postService.makeComment(this.comment).subscribe(data =>{
      this.postService.getComments(idPost).subscribe(comments => {
        this.pubComments = comments;
      });
      }, error => console.log(error)
    );
  }

  async makeCommentI(idPost: string, i: number){
    this.comment.comentario=this.comments[i];
    this.comment.publicacion_id=idPost;
    this.postService.makeComment(this.comment).subscribe(data =>{
      }, error=> console.log(error)
    );
  }

  async getProfile(){
    try{
      this.userService.findByToken().subscribe
      ((user: User) => {
        this.Owner = user;
        this.userService.downloadFile(this.Owner.foto_perfil).subscribe(
          data => {
            this.getPublicaciones();
            let objectURL = 'data:image/png;base64,' + data;
            this.profilepic = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          });
      });
    } catch (error) {
      alert("Error en la base de datos");
    }
  }

  async getPublicaciones() {
    await this.postService.getPosts().toPromise().then(async feed => {
      for (let index = 0; index < feed.length; index++) {
        let id = feed[index].id;
        let nombre_usuario = feed[index].person.nombre_usuario;
        let content = feed[index].contenido;
        let fecha = feed[index].fecha;
        await this.userService.downloadFile(feed[index].person.foto_perfil).toPromise().then(async data => {
          let objectURL = 'data:image/png;base64,' + data;
          let fotoperfil = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          if (feed[index].imagen != '')
          {
            await this.userService.downloadFile(feed[index].imagen).toPromise().then(data1 => {
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
    this.publications.sort((a, b) => b[2] - a[2]);
  }

  async showPublicacion(actualPub:any){
    //[nombre_usuario, content, fecha, fotoperfil, fotoadicional, id]
    this.showPub.person.nombre_usuario = actualPub[0];
    this.showPub.contenido = actualPub[1];
    this.showPub.fecha = actualPub[2];
    this.showPub.person.foto_perfil = actualPub[3];
    this.showPub.imagen = actualPub[4];
    this.showPub.id = actualPub[5];
    this.postService.getComments(actualPub[5]).subscribe(comments => {
      this.pubComments = comments;
      this.postService.getLikes(actualPub[5]).subscribe(thoselikes => this.likes = thoselikes);
    });
  }

  async makePost() {
    if(this.fileToUpload!=null){
      var uploadImageData = new FormData();
      uploadImageData.append('file', this.fileToUpload);
      uploadImageData.append('folder', 'Publicaciones/');
      this.userService.uploadFile(uploadImageData).subscribe(name => {
        this.post.imagen=name;
        this.postService.makePost(this.post).subscribe(data => {
          window.location.reload();
          }, error => {
            console.log(error);
          });
        }, error => {
          console.log(error);
        });
    }
    else{
      this.postService.makePost(this.post).subscribe(data => {
        window.location.reload();
        }, error => {
          console.log(error);
        });
    }
  }

  async reportarPublicacion(id: string){
    this.postService.reportar(id).subscribe();
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  routingFriendProfile(id_friend: string) {
    let ruta: string = "/profile/" + id_friend;
    this.router.navigate([ruta]);
  }

  redirectChat() {
    let ruta: string = "/chat";
    this.router.navigate([ruta]);
  }
}
