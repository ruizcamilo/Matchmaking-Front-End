import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Squad } from '../../model/squad';
import { SquadService } from '../../service/squad.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-feed-squads',
  templateUrl: './feed-squads.component.html',
  styleUrls: ['./feed-squads.component.css']
})
export class FeedSquadsComponent implements OnInit {

  squadsShow: any[] = [];
  mysquads: any[] = [];
  searchFilter: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private squadService: SquadService,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.squadService.getFriendsSquads().subscribe(thosesquads => {
      for (let i = 0; i < thosesquads.length; i++)
      {
        this.userService.downloadFile(thosesquads[i].imagen).subscribe(data => {
          let objectURL = 'data:image/png;base64,' + data;
          let fotosquad = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          this.squadsShow.push([thosesquads[i], fotosquad]);
        });
      }
    });
    this.squadService.getMySquads().subscribe(mysquads => {
      for (let i = 0; i < mysquads.length; i++)
      {
        this.userService.downloadFile(mysquads[i].imagen).subscribe(data => {
          let objectURL = 'data:image/png;base64,' + data;
          let fotosquad = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          this.mysquads.push([mysquads[i], fotosquad]);
          console.log(mysquads);
        });
      }
    });
  }

  joinSquad(uniSquad: Squad)
  {
    this.squadService.join(uniSquad).subscribe(data =>{
      this.router.navigate(['squad-view', { squadid: uniSquad.id_squad }]);
    });
  }

  leaveSquad(salSquad: Squad, position: number)
  {
    try{
      this.squadService.leaveSquad(salSquad).subscribe(data => {
        this.mysquads.splice(position,  1);
      });
    }catch{
      console.log("No se pudo salir");
    }
  }

  go2Squad(thisSquad: Squad)
  {
    this.router.navigate(['squad-view', {squadid: thisSquad.id_squad }]);
  }

  go2Create()
  {
    this.router.navigate(['create-squad']);
  }

}
