import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-main-search',
  templateUrl: './main-search.component.html',
  styleUrls: ['./main-search.component.css']
})
export class MainSearchComponent implements OnInit {

  search: string;
  usuarios: User[] = [];


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ){ }


  ngOnInit(): void {
    this.search = this.route.snapshot.paramMap.get("search");
    try {
      this.userService.searchUser(this.search).subscribe(
        (users: User[]) => {
          this.usuarios = users;
          console.log(this.usuarios);
        });
    } catch (error) {
      console.error(error);
    }
  }
  mostrarPublicaciones(): void
  {
    this.router.navigate(['/publication-search', { search: this.search } ]);
  }

  mostrarVideoJuegos(): void
  {
    this.router.navigate(['/videogame-search', { search: this.search } ]);
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
