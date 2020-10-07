import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/model/post';
import { PostService } from 'src/app/service/post.service'
import { PersonService } from 'src/app/service/person.service'
import { Person } from '../model/person';
import { UserService } from '../service/user.service';
import { Comment } from '../model/comment';


@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  comment: Comment = new Comment();
  fileToUpload: File = null;
  post: Post = new Post(null, "", "", "", false);
  myPosts: Post [] = [];
  MyfriendsPlaying: Person[] = [];
  MyfriendsChating: Person[] = [];
  personaPrueba:Person;
  pruebaPost:Post;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private postService: PostService,
    private personService: PersonService,
    private userService: UserService
  ) { }


  ngOnInit(): void {

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
  async darMeGusta(idPost: string){
    this.postService.like(idPost).subscribe(data =>{

    }, error=> console.log(error)
  );
  }

  async makeComment(idPost: string){
    this.comment.publicacion_id=idPost;
    this.postService.makeComment(this.comment).subscribe(data =>{

      }, error=> console.log(error)
    );
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

  routingFriendProfile(id_friend: string) {
    let ruta: string = "/profile/" + id_friend;
    this.router.navigate([ruta]);
  }
}
