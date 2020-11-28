import { removeSummaryDuplicates } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Person } from 'src/app/model/person';
import { User } from 'src/app/model/user';
import { PersonService } from 'src/app/service/person.service';
import { SquadService } from 'src/app/service/squad.service';
import { UserService } from 'src/app/service/user.service';
import { Squad } from '../../model/squad';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-create-squad',
  templateUrl: './create-squad.component.html',
  styleUrls: ['./create-squad.component.css']
})
export class CreateSquadComponent implements OnInit {

  fileToUpload: File = null;
  imageSrc: string;
  searchFilter: string;
  mymail: string;
  loading: boolean = false;
  myFriends: any[] = [];
  visibilidad: string = '';
  sendSquad: Squad = new Squad("", "", [], "", "", "", false);
  resultSquad: Squad = new Squad("", "", [], "", "", "", false);
  invitedFriends: string[] = [];
  Owner: User;
  imageSelected: string;
  person : Person = new Person ("","","");

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private personService: PersonService,
    private squadService: SquadService,
    private sanitizer: DomSanitizer,
    private storage: AngularFireStorage) { }

  ngOnInit(): void {
    this.mymail = sessionStorage.getItem('mail');
    this.getFriends();
  }

  async getFriends(){
    this.personService.getFriends(this.mymail).subscribe(
      (personas: Person[]) => {
       for (let index = 0; index < personas.length; index++) {
        this.userService.downloadFile(personas[index].foto_perfil).subscribe(data => {
          let objectURL = 'data:image/png;base64,' + data;
          let imagen = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          this.myFriends.push([personas[index], imagen]);
        }, error => console.log(error));
      }
      });
  }

  createSquad(){
    this.loading = true;
    let boolValue = (this.visibilidad == 'true');
    this.sendSquad.visibilidad = boolValue;
    if (this.fileToUpload != null) {
      let name = `Squads/`+Date.now()+"-"+this.fileToUpload.name;
      this.storage.upload(name, this.fileToUpload);
      this.sendSquad.imagen = name;
      this.squadService.create(this.sendSquad).subscribe(resultSquad => {
        this.resultSquad = resultSquad;
        this.squadService.sendInvitations(this.invitedFriends, this.sendSquad.nombre,this.resultSquad.id_squad).subscribe(result =>{
          this.router.navigate(['squads'], {queryParams: { squadid: this.resultSquad.id_squad } });
        });
      });
    }
    else {
      this.squadService.create(this.sendSquad).subscribe(resultSquad => {
        this.resultSquad = resultSquad;
        this.squadService.sendInvitations(this.invitedFriends,this.sendSquad.nombre,this.resultSquad.id_squad).subscribe(result =>{
          this.router.navigate(['squads'], {queryParams: { squadid: this.resultSquad.id_squad } });
        });
      });
    }
  }

  clickFriend(name: string){
    if (this.invitedFriends.includes(name))
    {
      this.invitedFriends.splice(this.invitedFriends.indexOf(name), 1);
    }else{
      this.invitedFriends.push(name);
    }
    console.log(this.myFriends);
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.imageSelected = this.fileToUpload.name;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {this.imageSrc = e.target.result; };
      reader.readAsDataURL(files[0]);
    }
  }
}
