import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Post } from 'src/app/model/post';
import { PostService } from 'src/app/service/post.service';
import { PersonService } from 'src/app/service/person.service';
import { ClanService } from 'src/app/service/clan.service';
import { Person } from 'src/app/model/person';
import { UserService } from 'src/app/service/user.service';
import { Comment } from 'src/app/model/comment';
import { User } from 'src/app/model/user';
import { Clan } from 'src/app/model/clan';
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-clan',
  templateUrl: './clan.component.html',
  styleUrls: ['./clan.component.css'],
})
export class ClanComponent implements OnInit {
  nuevoClan: Clan = new Clan(false, new Person('', '', ''), '', '', '');

  likes: number;
  comment: Comment = new Comment('', null, '', '');
  comments: string[] = [];
  showPub: Post = new Post(new Person('', '', ''), '', '', '', false);
  pubComments: Comment[] = [];
  profilepic: any;
  Owner: User;
  fileToUpload: File = null;
  post: Post = new Post(null, '', '', '', false);
  publications = [];
  MyfriendsPlaying: Person[] = [];
  MyfriendsChating: Person[] = [];
  personaPrueba: Person;
  pruebaPost: Post;
  myClans: Clan[] = [];
  clanActual: string;
  idRoute: string;
  miembrosClan: Person[] = [];
  refugiados: Person[] = [];
  isAdminVar: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private postService: PostService,
    private personService: PersonService,
    private clanService: ClanService,
    private userService: UserService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.idRoute = param['id'];

      console.log('routa clan compoent ' + this.idRoute);

      try {
        //clanes
        this.clanService.getMyClans().subscribe((clanes: Clan[]) => {
          this.myClans = clanes;
          if (this.idRoute != 'myClans') this.clanActual = this.idRoute;
          else this.clanActual = this.myClans[0].nombre_clan;
        });
        this.clanService.isAdmin(this.idRoute).subscribe((data) => {
          this.isAdminVar = data;
          console.log(
            '-------------------------------------' + this.isAdminVar
          );
        });
        //amigos chateando
        this.personService.getFriendsChat().subscribe((chating: Person[]) => {
          this.MyfriendsChating = chating;
        });
        if (this.idRoute == 'myClans') {
          this.clanService
            .getMembersOf(this.myClans[0].nombre_clan)
            .subscribe((members: Person[]) => {
              this.miembrosClan = members;
            });
          this.clanService
            .getRefugeesOf(this.myClans[0].nombre_clan)
            .subscribe((refugiado: Person[]) => {
              this.refugiados = refugiado;
            });
        } else {
          this.clanService
            .getMembersOf(this.idRoute)
            .subscribe((members: Person[]) => {
              this.miembrosClan = members;
            });
          this.clanService
            .getRefugeesOf(this.idRoute)
            .subscribe((refugiado: Person[]) => {
              this.refugiados = refugiado;
            });
        }
      } catch (error) {
        console.error(error);
      }

      if (this.idRoute == 'myClans') {
        try {
          this.getProfile();
        } catch (error) {
          console.error(error);
        }
      } else {
        try {
          this.getProfile2(this.idRoute);
        } catch (error) {
          console.error(error);
        }
      }
    });
  }
  async darMeGusta(idPost: string) {
    this.postService.like(idPost).subscribe(
      (data) => {
        this.postService
          .getLikes(idPost)
          .subscribe((thoselikes) => (this.likes = thoselikes));
      },
      (error) => console.log(error)
    );
  }

  async makeComment(idPost: string) {
    this.comment.publicacion_id = idPost;
    this.postService.makeComment(this.comment).subscribe(
      (data) => {
        this.postService.getComments(idPost).subscribe((comments) => {
          this.pubComments = comments;
        });
      },
      (error) => console.log(error)
    );
  }

  async makeCommentI(idPost: string, i: number) {
    this.comment.comentario = this.comments[i];
    this.comment.publicacion_id = idPost;
    this.postService.makeComment(this.comment).subscribe(
      (data) => {},
      (error) => console.log(error)
    );
  }

  async getProfile() {
    try {
      this.userService.findByToken().subscribe((user: User) => {
        this.Owner = user;
        this.userService
          .downloadFile(this.Owner.foto_perfil)
          .subscribe((data) => {
            this.getPublicaciones(this.myClans[0].nombre_clan); /// HAY QUE MIRAR ESTA MIERDA
            let objectURL = 'data:image/png;base64,' + data;
            this.profilepic = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          });
      });
    } catch (error) {
      alert('Error en la base de datos');
    }
  }
  async getProfile2(nomClan: string) {
    try {
      this.userService.findByToken().subscribe((user: User) => {
        this.Owner = user;
        this.userService
          .downloadFile(this.Owner.foto_perfil)
          .subscribe((data) => {
            this.getPublicaciones(nomClan); /// HAY QUE MIRAR ESTA MIERDA
            let objectURL = 'data:image/png;base64,' + data;
            this.profilepic = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          });
      });
    } catch (error) {
      alert('Error en la base de datos');
    }
  }

  async getPublicaciones(nombreClan: string) {
    await this.clanService
      .getPosts(nombreClan)
      .toPromise()
      .then(async (feed) => {
        this.publications = [];
        if (feed.length != null) {
          for (let index = 0; index < feed.length; index++) {
            let id = feed[index].id;
            let nombre_usuario = feed[index].person.nombre_usuario;
            let content = feed[index].contenido;
            let fecha = feed[index].fecha;
            await this.userService
              .downloadFile(feed[index].person.foto_perfil)
              .toPromise()
              .then(async (data) => {
                let objectURL = 'data:image/png;base64,' + data;
                let fotoperfil = this.sanitizer.bypassSecurityTrustUrl(
                  objectURL
                );
                if (feed[index].imagen != '') {
                  await this.userService
                    .downloadFile(feed[index].imagen)
                    .toPromise()
                    .then((data1) => {
                      let objectURL1 = 'data:image/png;base64,' + data1;
                      let fotoadicional = this.sanitizer.bypassSecurityTrustUrl(
                        objectURL1
                      );
                      this.publications.push([
                        nombre_usuario,
                        content,
                        fecha,
                        fotoperfil,
                        fotoadicional,
                        id,
                      ]);
                    });
                } else {
                  this.publications.push([
                    nombre_usuario,
                    content,
                    fecha,
                    fotoperfil,
                    null,
                    id,
                  ]);
                }
              });
          }
        }
      });
  }

  async showPublicacion(actualPub: any) {
    //[nombre_usuario, content, fecha, fotoperfil, fotoadicional, id]
    this.showPub.person.nombre_usuario = actualPub[0];
    this.showPub.contenido = actualPub[1];
    this.showPub.fecha = actualPub[2];
    this.showPub.person.foto_perfil = actualPub[3];
    this.showPub.imagen = actualPub[4];
    this.showPub.id = actualPub[5];
    this.postService.getComments(actualPub[5]).subscribe((comments) => {
      this.pubComments = comments;
      this.postService
        .getLikes(actualPub[5])
        .subscribe((thoselikes) => (this.likes = thoselikes));
    });
  }

  async makePost() {
    if (this.fileToUpload != null) {
      console.log('somo tontos o que ' + this.fileToUpload.name);
      var uploadImageData = new FormData();
      uploadImageData.append('file', this.fileToUpload);
      uploadImageData.append('folder', 'Publicaciones/');
      this.userService.uploadFile(uploadImageData).subscribe(
        (name) => {
          this.post.imagen = name;
          console.log(
            '++++++++++++++++++++++++++++++++++++++++++++++' + this.clanActual
          );

          this.clanService.makePost(this.post, this.clanActual).subscribe(
            (data) => {
              //window.location.reload();
            },
            (error) => {
              console.log(error);
            }
          );
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      console.log(
        '++++++++++++++++++++++++++++++++++++++++++++++' + this.clanActual
      );
      this.clanService.makePost(this.post, this.clanActual).subscribe(
        (data) => {
          //window.location.reload();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  async reportarPublicacion(id: string) {
    this.postService.reportar(id).subscribe();
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  routingFriendProfile(id_friend: string) {
    let ruta: string = '/profile/' + id_friend;
    this.router.navigate([ruta]);
  }

  redirectChat() {
    let ruta: string = '/chat';
    this.router.navigate([ruta]);
  }

  mostrarFeedClanActual(posClan: number) {
    console.log('posicion ' + posClan);
    try {
      this.getPublicaciones(this.myClans[posClan].nombre_clan);
      this.clanActual = this.myClans[posClan].nombre_clan;
    } catch (error) {
      //alert("Error encontrando publicaciones del clan");
    }
  }

  createClan(nuevoClan: Clan) {
    if (this.fileToUpload != null) {
      var uploadImageData = new FormData();
      uploadImageData.append('file', this.fileToUpload);
      uploadImageData.append('folder', 'Clanes/');
      this.userService.uploadFile(uploadImageData).subscribe(
        (name) => {
          this.nuevoClan.foto_clan = name;
          this.clanService.makeClan(this.nuevoClan).subscribe(
            (data) => {
              window.location.reload();
            },
            (error) => {
              console.log(error);
            }
          );
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.clanService.makeClan(this.nuevoClan).subscribe(
        (data) => {
          window.location.reload();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  desterrar(exMiembro: Person, nomClan: string) {
    if (this.idRoute == 'myClans') {
      this.clanService
        .exile(exMiembro, this.myClans[0].nombre_clan)
        .subscribe((data) => {});
    } else {
      this.clanService.exile(exMiembro, this.idRoute).subscribe((data) => {});
    }
  }
  abandonarRefujiado(refujiado: Person) {
    if (this.idRoute == 'myClans') {
      this.clanService
        .abandonRefugee(refujiado, this.myClans[0].nombre_clan)
        .subscribe((data) => {});
    } else {
      this.clanService
        .abandonRefugee(refujiado, this.idRoute)
        .subscribe((data) => {});
    }
  }

  darAsilo(refugiado: Person) {
    if (this.idRoute == 'myClans') {
      this.clanService
        .shelter(refugiado, this.myClans[0].nombre_clan)
        .subscribe((data) => {});
    } else {
      this.clanService
        .shelter(refugiado, this.clanActual)
        .subscribe((data) => {});
    }
  }
}
