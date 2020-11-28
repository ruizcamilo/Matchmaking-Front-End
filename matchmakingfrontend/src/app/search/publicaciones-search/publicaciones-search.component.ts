import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/model/post';
import { PostService } from 'src/app/service/post.service';
import { UserService } from 'src/app/service/user.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-publicaciones-search',
  templateUrl: './publicaciones-search.component.html',
  styleUrls: ['./publicaciones-search.component.css']
})
export class PublicacionesSearchComponent implements OnInit {

  search: string;
  publications: any[] = [];
  post: Post[] = [
    {id: '60WHakdO1LyWF1jraQFK',
    person: {persona_id: 'sumadre@gmail.com', nombre_usuario: 'Stormy', foto_perfil: 'https://compass-ssl.xbox.com/assets/92/5d/925d1321-89fe-4537-9303-a64adaf27c07.jpg?n=Halo-MCC_GLP-Page-Hero-1084_1920x1040.jpg'},
    contenido: 'Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original. Fue popularizado en los 60s con la creación de las hojas "Letraset", las cuales contenian pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus PageMaker, el cual incluye versiones de Lorem Ipsum.',
    fecha: '12:20pm - Marzo 25, 2000',
    imagen: '',
    reportado: false},
    {id: '60WHakdO1LyWF1jraQFK',
    person: {persona_id: 'sumadre@gmail.com', nombre_usuario: 'Stormy', foto_perfil: 'https://compass-ssl.xbox.com/assets/92/5d/925d1321-89fe-4537-9303-a64adaf27c07.jpg?n=Halo-MCC_GLP-Page-Hero-1084_1920x1040.jpg'},
    contenido: 'Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original. Fue popularizado en los 60s con la creación de las hojas "Letraset", las cuales contenian pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus PageMaker, el cual incluye versiones de Lorem Ipsum.',
    fecha: '12:20pm - Marzo 25, 2000',
    imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Prise_de_la_Bastille.jpg/300px-Prise_de_la_Bastille.jpg',
    reportado: false}];
    done = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private userService: UserService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.search = this.route.snapshot.paramMap.get('search');
    try {
      this.postService.searchPost(this.search).subscribe(
        (post: Post[]) => {
          console.log(post);
          for (let index = 0; index < post.length; index++) {
            this.userService.downloadFile(post[index].person.foto_perfil).subscribe(data => {
              let objectURL = 'data:image/png;base64,' + data;
              let fotoperfil = this.sanitizer.bypassSecurityTrustUrl(objectURL);
              if (post[index].imagen != '')
              {
                this.userService.downloadFile(post[index].imagen).subscribe(data1 => {
                  let objectURL1 = 'data:image/png;base64,' + data1;
                  let fotoadicional = this.sanitizer.bypassSecurityTrustUrl(objectURL1);
                  this.publications.push([post[index], fotoperfil, fotoadicional]);
                });
              }else{
                this.publications.push([post[index], fotoperfil, null]);
              }
            });
          }
          this.done = true;
        });
    } catch (error) {
      console.error(error);
    }
  }
  mostrarVideoJuegos(): void {
    this.router.navigate(['/videogame-search', { search: this.search }]);
  }

  mostrarUsuarios(): void {
    this.router.navigate(['/main-search', { search: this.search }]);
  }

  mostrarClanes(): void
  {
    this.router.navigate(['/clan-search', { search: this.search } ]);
  }

  mostrarSquads(): void
  {
    this.router.navigate(['/squad-search', { search: this.search } ]);
  }

}
