import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/model/post';
import { PostService } from 'src/app/service/post.service';

@Component({
  selector: 'app-publicaciones-search',
  templateUrl: './publicaciones-search.component.html',
  styleUrls: ['./publicaciones-search.component.css']
})
export class PublicacionesSearchComponent implements OnInit {

  search: string;
  post: Post[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
  ) { }

  ngOnInit(): void {
    this.search = this.route.snapshot.paramMap.get("search");
    try {
      this.postService.searchPost(this.search).subscribe(
        (post: Post[]) => {
          this.post = post;
        });
    } catch (error) {
      console.error(error);
    }
  }
  mostrarVideoJuegos(): void {
    this.router.navigate(['/buscarVideojuegos', { search: this.search }])
  }

  mostrarUsuarios(): void {
    this.router.navigate(['/main-search', { search: this.search }]);
  }

}
