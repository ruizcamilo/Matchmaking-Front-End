import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Person } from 'src/app/model/person';
import { Post } from 'src/app/model/post';
import { User } from 'src/app/model/user';
import { PostService } from 'src/app/service/post.service';
import { UserService } from '../../service/user.service';
import { PersonService } from '../../service/person.service';
import { Comment } from '../../model/comment';
import { NumberSymbol } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  likes: number;
  comment: Comment = new Comment('', null, '', '');
  comments: string[] = [];
  fileToUpload: File = null;
  post: Post = new Post(null, '', '', '', false);
  Owner: User;
  profilepic: any;
  publicaciones = [
    {srcperfil:"https://i.imgur.com/uSlStch.jpg", srccontenido:"https://i.imgur.com/ZKbpmaU.jpg", titulo:"Green plants are going to extinct about 500 times", contenido:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard", Username:"Bobomilo", Date:"Jan 20,2020"},
    {srcperfil:"https://i.ibb.co/H7rLhQr/pic-profile.png", srccontenido:"https://hipertextual.com/files/2020/07/hipertextual-halo-infinite-seguira-pasos-fortnite-y-su-multijugador-sera-gratuito-2020339362.jpg", titulo:"Que chimba el nuevo Halito!!", contenido:"Hoy vi el nuevo trailer y casi me voy de culo!! Excelente!!", Username:"StormyFiddle", Date:"Sep 29,2020"}
  ];

  showPub: Post = new Post(new Person('', '', ''), '', '', '', false);
  pubComments: Comment[] = [];
  publications = [];
  myFriends = [];
  juegosFav = [];
  anchoNumero = 0;

  constructor(
    private route: ActivatedRoute,
    private afAuth: AngularFireAuth,
    private router: Router,
    private userService: UserService,
    private personService: PersonService,
    private postService: PostService,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getProfile();
    let v = new Comment('AAA', new Person('bla', 'bla', 'bla'), 'Uyyy cual es el DM ricura', '1234567890.123');
    this.pubComments.push(v);
    this.pubComments.push(v);
    this.pubComments.push(v);
  }

  async getProfile(){
    try{
      this.userService.findByToken().subscribe
      ((user: User) => {
        this.Owner = user;
        this.userService.downloadFile(this.Owner.foto_perfil).subscribe(
          data => {
            this.getFriends();
            this.getPublicaciones();
            this.getFavoriteGames();
            let objectURL = 'data:image/png;base64,' + data;
            this.profilepic = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          });
      });
    } catch (error) {
      alert("Error en la base de datos");
    }
  }

  async getPublicaciones() {
    this.postService.getMyPosts(this.Owner.correo).subscribe(myposts => {
      console.log("posts");
      console.log(myposts);
      for (let index = 0; index < myposts.length; index++) {
        let id = myposts[index].id;
        let nombre_usuario = myposts[index].person.nombre_usuario;
        let content = myposts[index].contenido;
        let fecha = myposts[index].fecha;
        this.userService.downloadFile(myposts[index].person.foto_perfil).subscribe(data => {
          let objectURL = 'data:image/png;base64,' + data;
          let fotoperfil = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          if (myposts[index].imagen != '')
          {
            this.userService.downloadFile(myposts[index].imagen).subscribe(data1 => {
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

  async getFavoriteGames(){
    this.personService.getFavorites(this.Owner.correo).subscribe(favorites => {
      console.log("favoritos");
      console.log(favorites);
      for (let index = 0; index < favorites.length; index++) {
        let nombre = favorites[index].nombre;
        this.userService.downloadFile(favorites[index].imagen).subscribe(data => {
          let objectURL = 'data:image/png;base64,' + data;
          let imagen = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          this.juegosFav.push([nombre, imagen]);
          this.anchoNumero += 170;
        });
      }
    });
  }

  async getFriends(){
    this.personService.getFriends(this.Owner.correo).subscribe(
      (personas: Person[]) => {
       console.log("personas");
       console.log(personas);
       for (let index = 0; index < personas.length; index++) {
        let username = personas[index].nombre_usuario;
        let mail =  personas[index].persona_id;
        this.userService.downloadFile(personas[index].foto_perfil).subscribe(data => {
          let objectURL = 'data:image/png;base64,' + data;
          let imagen = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          this.myFriends.push([username, imagen, mail]);
        }, error => console.log(error));
      }
      });
  }

  async makePost() {
    if (this.fileToUpload != null){
      var uploadImageData = new FormData();
      uploadImageData.append('file', this.fileToUpload);
      uploadImageData.append('folder', 'Publicaciones/');
      this.userService.uploadFile(uploadImageData).subscribe(name => {
        this.post.imagen = name;
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

  async darMeGusta(idPost: string){
    this.postService.like(idPost).subscribe(data =>{
      this.postService.getLikes(idPost).subscribe(thoselikes => this.likes = thoselikes);
    }, error=> console.log(error)
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
    this.comment.comentario = this.comments[i];
    this.comment.publicacion_id = idPost;
    this.postService.makeComment(this.comment).subscribe(data =>{

      }, error=> console.log(error)
    );
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
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

  async reportarPublicacion(id: string){
    this.postService.reportar(id).subscribe();
  }
}
