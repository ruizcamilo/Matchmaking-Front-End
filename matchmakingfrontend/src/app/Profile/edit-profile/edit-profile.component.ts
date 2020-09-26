import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { tokenName } from '@angular/compiler';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  search: string;
  consolas: string[] = [
    'Playstation 4',
    'Xbox One',
    'PC',
    'Xbox 360',
    'PlayStation 3',
  ];
  juegos: string[] = [
    'Call of Duty: Modern Warfare',
    'Fortnite',
    'Gears of War',
    'Halo 4',
    'CounterStrike',
  ];
  juegosOpciones: string[] = [];
  juegosEscogidos: string[] = [];
  userSend: User;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  async update() {
    this.userService.updateUser(this.userSend);
  }
  searchGame() {
    this.juegosEscogidos.push(this.search);
  }
  ngOnInit(): void {
    this.userService.findByToken().subscribe
    ((user:User) => {
      this.userSend = user;
    });
  }
}
