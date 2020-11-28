import { Component, OnInit, Sanitizer } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoJuego } from 'src/app/model/video-juego';
import { UserService } from 'src/app/service/user.service';
import { VideoJuegoService } from 'src/app/service/video-juego.service';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-admin-video-games',
  templateUrl: './admin-video-games.component.html',
  styleUrls: ['./admin-video-games.component.css']
})
export class AdminVideoGamesComponent implements OnInit {

  allGamesAdmin: VideoJuego[] = [];
  allGamesAdminShow = [];
  editGame: any = "";
  editImage: string;
  showGame: VideoJuego = new VideoJuego("","");
  anchoNumero = 0;
  nombrejuego: String;
  profilepic: any;
  game: VideoJuego =  new VideoJuego("", "");
  fileToUpload: File =  null;
  fileToUploadModal: File = null;
  imageSelected: string;
  imageSelectedModal: string;
  imageSrc: string;
  modalImageSrc: string;
  eventMessage: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private gameService: VideoJuegoService,
    private userService: UserService,
    private sanitizer: DomSanitizer,
    private storage: AngularFireStorage
  ) { }

  ngOnInit(): void {
    this.gameService.getAllGames().subscribe(
      allGames => {
        this.allGamesAdmin = allGames;
        for (let index = 0; index < this.allGamesAdmin.length; index++) {
          this.userService.downloadFile(this.allGamesAdmin[index].imagen).subscribe(data => {
            let objectURL = 'data:image/png;base64,' + data;
            let imagen = this.sanitizer.bypassSecurityTrustUrl(objectURL);
            this.allGamesAdminShow.push([allGames[index], imagen]);
            this.anchoNumero += 170;
          });
        }
      });
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

  mostrarJuegoAdmin(juego: any): void
  {
    this.fileToUploadModal = null;
    this.imageSelectedModal = null;
    this.modalImageSrc = null;
    this.editGame = juego[0];
    this.editImage = juego[1];
    this.nombrejuego = juego[0].nombre;
  }
  modificarJuego():void
  {
    if (this.fileToUploadModal != null){
      let name = `Juegos/`+Date.now()+"-"+this.fileToUpload.name;
      this.storage.upload(name, this.fileToUpload);
      this.editGame.imagen = name;
      const anterior = this.editGame.nombre;
      this.editGame.nombre = this.nombrejuego;
      this.editGame.imagen = name;
      this.gameService.modificarGame(this.editGame, anterior).subscribe(data => {
        window.location.reload();
        }, error => { console.log(error);
      });
    }else{
      const anterior = this.editGame.nombre;
      this.editGame.nombre = this.nombrejuego;
      this.gameService.modificarGame(this.editGame, anterior).subscribe();
    }
  }

  eliminarJuego():void
  {
    this.gameService.deleteGame(this.editGame).subscribe( deleteGame =>
      {
        window.location.reload();
      });
  }
  handleFileInput(files: FileList) {​​
    this.fileToUpload = files.item(0);
    this.imageSelected = this.fileToUpload.name;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {this.imageSrc = e.target.result; };
      reader.readAsDataURL(files[0]);
    }
  }

  handleFileInputModal(files: FileList) {​​
    this.fileToUploadModal = files.item(0);
    this.imageSelectedModal = this.fileToUploadModal.name;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {this.modalImageSrc = e.target.result; };
      reader.readAsDataURL(files[0]);
    }
  }
  ​​
  makeGame():void{
    if(this.fileToUpload != null && this.game.nombre != ''){
      let name = `Juegos/`+Date.now()+"-"+this.fileToUpload.name;
      this.storage.upload(name, this.fileToUpload);
      this.editGame.imagen = name;
      this.game.imagen = name;
      this.gameService.makeGame(this.game).subscribe(data => {
        window.location.reload();
        }, error => {
          console.log(error);
      });
    }
    else if (this.fileToUpload == null && this.game.nombre != ''){
      this.eventMessage = "Debe ingresar una foto";
    }else if (this.game.nombre == '' && this.fileToUpload != null ){
      this.eventMessage = "Debe ingresar un nombre";
    }else{
      this.eventMessage = "Debe ingresar un nombre y una foto";
    }

  }
}
