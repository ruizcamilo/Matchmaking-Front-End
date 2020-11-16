import { Component, OnInit, Sanitizer } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoJuego } from 'src/app/model/video-juego';
import { UserService } from 'src/app/service/user.service';
import { VideoJuegoService } from 'src/app/service/video-juego.service';

@Component({
  selector: 'app-admin-video-games',
  templateUrl: './admin-video-games.component.html',
  styleUrls: ['./admin-video-games.component.css']
})
export class AdminVideoGamesComponent implements OnInit {

  allGamesAdmin: VideoJuego[] = [];
  allGamesAdminShow = [];
  showGame: VideoJuego = new VideoJuego("","");
  anchoNumero = 0;
  nombrejuego: String;
  profilepic: any;
  game: VideoJuego =  new VideoJuego("", "");
  fileToUpload: File =  null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private gameService: VideoJuegoService,
    private userService: UserService,
    private sanitizer: DomSanitizer,

  ) { }

  ngOnInit(): void {
    this.gameService.getAllGames().subscribe(
      allGames => {
        this.allGamesAdmin = allGames;

        for (let index = 0; index < this.allGamesAdmin.length; index++) {
          let nombre = this.allGamesAdmin[index].nombre;
          this.userService.downloadFile(this.allGamesAdmin[index].imagen).subscribe(data => {
            let objectURL = 'data:image/png;base64,' + data;
            let imagen = this.sanitizer.bypassSecurityTrustUrl(objectURL);
            this.allGamesAdminShow.push([nombre, imagen]);
            this.anchoNumero += 170;
          });
        }
      }
    )

  }


  mostrarUsuariosReportados(): void
  {
    this.router.navigate(['/userReported']);
  }
  mostrarPublicacionesReportadas(): void
  {
    this.router.navigate(['/postReported']);
  }
  mostrarVideoJuegosAdmin(): void
  {
    this.router.navigate(['/videoGames']);
  }

  mostrarJuegoAdmin(juego: any):  void
  {
    this.showGame.nombre = juego[0];
  }
  modificarJuego(nombrejuego: any):void
  {
    for (let index = 0; index < this.allGamesAdmin.length; index++) 
    {
      if( this.showGame.nombre == this.allGamesAdmin[index].nombre)
      {
        let anterior = this.allGamesAdmin[index].nombre;
        this.allGamesAdmin[index].nombre =  nombrejuego;
        this.gameService.modificarGame(this.allGamesAdmin[index], anterior).subscribe( updateGame =>
        {

        })
        console.log(this.showGame.nombre + " "+ nombrejuego);

      }
    }

  }

  eliminarJuego(nombrejuego: any):void
  {
    for (let index = 0; index < this.allGamesAdmin.length; index++) 
    {
      if( this.showGame.nombre == this.allGamesAdmin[index].nombre)
      {
        
        this.gameService.deleteGame(this.allGamesAdmin[index]).subscribe( deleteGame =>
        {

          window.location.reload();
        })
        console.log(this.showGame.nombre + " "+ nombrejuego);

      }
    }

  }
  handleFileInput(files: FileList) {​​

    this.fileToUpload = files.item(0);

  }​​
  makeGame():void{
    if(this.fileToUpload!=null){
      var uploadImageData = new FormData();
      uploadImageData.append('file', this.fileToUpload);
      uploadImageData.append('folder', 'Juegos/');
      this.userService.uploadFile(uploadImageData).subscribe(name => {
        this.game.imagen =name;
        this.gameService.makeGame(this.game).subscribe(data => {
          window.location.reload();
          }, error => {
            console.log(error);
          });
        }, error => {
          console.log(error);
        });
    }
    else{
      this.gameService.makeGame(this.game).subscribe(data => {
        window.location.reload();
        }, error => {
          console.log(error);
        });
    }

  }
}
