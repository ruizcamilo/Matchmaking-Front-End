import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-friend-profile',
  templateUrl: './friend-profile.component.html',
  styleUrls: ['./friend-profile.component.css']
})
export class FriendProfileComponent implements OnInit {
  isRequestSend: boolean = false;
  isFriend: boolean = false;
  Owner: User;
  ancho: string;
  consolas = [
    {url:"https://thegroyne.com/wp-content/uploads/2015/03/Playstation-4-PS4-Logo-1280x720.png",consola:"Playstation 4"},
    {url:"https://generacionxbox.com/wp-content/uploads/2016/03/Logo-consola-solo-xbox-one-150316.jpg",consola:"Xbox One"}
  ];
  juegos = [
  {url: "https://www.mundodeportivo.com/r/GODO/MD/p6/ContraPortada/Imagenes/2019/07/26/Recortada/img_sbustos_20190726-164151_imagenes_md_otras_fuentes_portada_van_dijk_fifa_20-kLaG--572x713@MundoDeportivo-Web.jpg", juego:"Fifa 20"},
  {url: "https://i.pinimg.com/474x/8c/e8/ab/8ce8aba0edcb78be32945243a3d9b4e6.jpg", juego:"Fortnite"},
  {url:"https://cnet1.cbsistatic.com/img/l8RbnOsHzo6C0fHx-A7yGCDZxGI=/1200x675/2019/09/18/c07d7cfa-5cc7-4d64-a3bb-aabf6b778dcc/call-of-duty-mobile.jpg", juego:"Call of Duty: Mobile"},
  {url:"https://store-images.s-microsoft.com/image/apps.58021.69011092827716296.e9190db7-6f4c-478c-8555-3edad4336a39.de8bb314-af23-4670-9343-fa78251591c8?mode=scale&q=90&h=1080&w=1920", juego:"Assassins Creed II"},
  {url:"https://i.pinimg.com/474x/37/09/e5/3709e5fc07c93f1d39a98826cf000748--rockets-gaming.jpg", juego:"Rocket League"}
  ];
  publicaciones = [
    {srcperfil:"https://i.imgur.com/uSlStch.jpg", srccontenido:"https://i.imgur.com/ZKbpmaU.jpg", titulo:"Green plants are going to extinct about 500 times", contenido:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard", Username:"Bobomilo", Date:"Jan 20,2020"},
    {srcperfil:"https://i.ibb.co/H7rLhQr/pic-profile.png", srccontenido:"https://hipertextual.com/files/2020/07/hipertextual-halo-infinite-seguira-pasos-fortnite-y-su-multijugador-sera-gratuito-2020339362.jpg", titulo:"Que chimba el nuevo Halito!!", contenido:"Hoy vi el nuevo trailer y casi me voy de culo!! Excelente!!", Username:"StormyFiddle", Date:"Sep 29,2020"}
  ];

  constructor(
    private route: ActivatedRoute,
    private afAuth: AngularFireAuth,
    private router: Router,
    private userService: UserService) { }



  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let id = params['id'];
      try {
        this.userService.findById(id).subscribe
          ((user: User) => {
            this.Owner = user;
            //Cargar imagenes
            this.calcularAncho();
          });

/*           this.userService.isFriend(id).subscribe
          ((friend: boolean) => {
              this.isFriend = friend;
              if(!this.isFriend){
                this.userService.isRequestSend(id).subscribe
                ((request: boolean) => {
                    this.isRequestSend = request;
                });
              }
          }); */

      } catch (error) {
        alert("Error en la base de datos");
      }
      console.log(this.Owner);
    });

  }

  calcularAncho(){
    var numero = 170 * this.juegos.length;
    this.ancho ="width:"+numero.toString()+"px;";
    console.log(this.ancho);
  }
  report(): void{
    this.route.params.subscribe(params => {
      let id = params['id'];
      try {
        this.userService.reportById(id).subscribe(data => {
          // do something, if upload success
          }, error => {
            console.log(error);
          });;
      } catch (error) {
        alert("Error en la base de datos");
      }
    });
  }

  addFriend(): void{
    this.route.params.subscribe(params => {
      let id = params['id'];
      try {
        this.userService.addFriendById(id).subscribe(data => {
            this.isRequestSend = true;
            this.isFriend = false;
          }, error => {
            console.log(error);
          });;
      } catch (error) {
        alert("Error en la base de datos");
      }
    });
  }

  deleteFriend(): void{
    this.route.params.subscribe(params => {
      let id = params['id'];
      try {
        this.userService.deleteFriendById(id).subscribe(data => {
            this.isFriend = false;
            this.isRequestSend = false;
          }, error => {
            console.log(error);
          });;
      } catch (error) {
        alert("Error en la base de datos");
      }
    });
  }
}
