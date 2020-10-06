import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/model/post';
import { PostService } from 'src/app/service/post.service'
import { PersonService } from 'src/app/service/person.service'
import { Person } from '../model/person';
import { UserService } from '../service/user.service';


@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  fileToUpload: File = null;
  post: Post = new Post(null, "", "", "", false);
  myPosts: Post [] = [];
  MyfriendsPlaying: Person[] = [];
  MyfriendsChating: Person[] = [];
  personaPrueba:Person;
  pruebaPost:Post;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private personService: PersonService,
    private userService: UserService
  ) { }


  ngOnInit(): void {
    this.personaPrueba = new Person("idPrueba", "Pepito Perez", "https://i.imgur.com/uSlStch.jpg");
    this.MyfriendsPlaying.push(this.personaPrueba);
    this.MyfriendsChating.push(this.personaPrueba);
    this.pruebaPost =  new Post(this.personaPrueba, "un contenido de prueba", "23-00-00", "https://i.imgur.com/ZKbpmaU.jpg",false);
    this.myPosts.push(this.pruebaPost);
    this.pruebaPost =  new Post(this.personaPrueba, "otro contenido de prueba", "23-00-00", "https://i.imgur.com/ZKbpmaU.jpg",false);
    this.myPosts.push(this.pruebaPost);
    this.MyfriendsPlaying.push(this.personaPrueba);
    this.MyfriendsChating.push(this.personaPrueba);

    console.log(this.myPosts.length);
      try {
        this.postService.getPosts().subscribe(
          (posts: Post[]) => {
            this.myPosts = posts;
          });
        //amigos jugando
        this.personService.getFriends().subscribe(
           (personas: Person[]) => {
            this.MyfriendsPlaying = personas;
           });
        //amigos chateando
        this.personService.getFriendsChat().subscribe(
           (chating: Person[]) => {
            this.MyfriendsChating = chating;
           });
      } catch (error) {
        console.error(error);
      }
  }
  async makePost() {
    if(this.fileToUpload!=null){
      var uploadImageData = new FormData();
      uploadImageData.append('file', this.fileToUpload);
      uploadImageData.append('folder', 'Publicaciones/');
      this.userService.uploadFile(uploadImageData).subscribe(name => {
        this.post.imagen=name;
        this.postService.makePost(this.post).subscribe(data => {
          // do something, if upload success
          }, error => {
            console.log(error);
          });
        }, error => {
          console.log(error);
        });
    }
    else{
      this.postService.makePost(this.post).subscribe(data => {
        // do something, if upload success
        }, error => {
          console.log(error);
        });
    }
  }
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }
}
