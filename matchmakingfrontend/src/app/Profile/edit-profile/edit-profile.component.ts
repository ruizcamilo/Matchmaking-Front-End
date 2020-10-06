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
  fileToUpload: File = null;
  search: string;
  consolas: string[] = [
    'PS4',
    'Xbox One',
    'PC',
  ];
  juegos: string[] = [
    'Call of Duty: Modern Warfare',
    'Fortnite',
    'Gears of War',
    'Halo 4',
    'CounterStrike',
  ];
  regions = [
    { label: 'Norteamerica', value: 1 },
    { label: 'Sudamerica', value: 2 },
    { label: 'Europa', value: 3 },
    { label: 'Asia', value: 4 },
    { label: 'Oceania', value: 5 },
    { label: 'Africa', value: 6 }
  ];
  juegosOpciones: string[] = [];
  juegosEscogidos: string[] = [];
  selectedRegion: string;
  userSend: User = new User("","","","","","",0,"","",false,[]);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}
  async update() {
    var uploadImageData = new FormData();
    uploadImageData.append('file', this.fileToUpload);
    uploadImageData.append('folder', 'Fotosperfil/');
    this.userSend.foto_perfil='Fotosperfil/'+this.fileToUpload;
    this.userService.uploadFile(uploadImageData).subscribe(name => {
      this.userSend.foto_perfil=name;
      this.userService.updateUser(this.userSend).subscribe(data => {
        // do something, if upload success
        }, error => {
          console.log(error);
        });
      }, error => {
        console.log(error);
      });
  }
  searchGame() {
    this.juegosEscogidos.push(this.search);
  }
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }
  ngOnInit(): void {
    this.userService.findByToken().subscribe
    ((user:User) => {
      this.userSend = user;
    });
  }
}
