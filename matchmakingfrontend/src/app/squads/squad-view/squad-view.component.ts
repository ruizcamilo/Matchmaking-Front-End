import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Mensaje } from 'src/app/model/mensaje';
import { Squad } from 'src/app/model/squad';
import { ChatService } from 'src/app/service/chat.service';
import { PersonService } from 'src/app/service/person.service';
import { UserService } from 'src/app/service/user.service';
import { SquadService } from '../../service/squad.service';
import { Person } from 'src/app/model/person';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-squad-view',
  templateUrl: './squad-view.component.html',
  styleUrls: ['./squad-view.component.css']
})
export class SquadViewComponent implements OnInit {
  id: string = '';
  colors: string [] = ['#ff962c', '#db5226', '#a50741', '#34495E', '#52BE80', '#566573', '#3498DB', '#784212'];
  fileToUpload: File = null;
  imageSrc: string;
  imageSelected: string;
  myusername: string;
  mymail: string;
  theSquad: Squad;
  members: any[] = [];
  squadPhoto: any;
  messages: Mensaje [] = [];
  mensajeNuevoFull: Mensaje;
  newName: string;
  myFriends: any[] = [];
  searchFilter: string;
  messageSend: Mensaje = new Mensaje('', '', '', '');
  @ViewChild('scroll') scroll: ElementRef;
  scrolltop: number = null;
  eventMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private afStore: AngularFirestore,
    private chatService: ChatService,
    private squadService: SquadService,
    private personService: PersonService,
    private userService: UserService,
    private sanitizer: DomSanitizer,
    private storage: AngularFireStorage) { }

  ngOnInit(): void {
    this.myusername = sessionStorage.getItem('gamertag');
    this.mymail = sessionStorage.getItem('mail');
    this.route.params.subscribe(params => {
      this.id = params['squadid'];
      if (this.id == '')
      {
        console.log("No habia parametro");
        this.router.navigate(['squads']);
      }
      else{
        this.squadService.getSquad(this.id).subscribe(squad => {
          console.log(squad);
          let amMember = false;
          for (const squadmember of squad.integrantes)
          {
            if (squadmember.persona_id == this.mymail)
            {
              amMember = true;
            }
          }
          if (amMember)
          {
            this.theSquad = squad;
            this.newName = this.theSquad.nombre;
            this.getMembers();
            this.getPhoto();
            this.getChat();
            this.getFriends();
          }else{
            console.log("No soy miembro");
            this.router.navigate(['squads']);
          }
        });
      }
    });
  }

  getMembers(){
    this.afStore.collection('Squad').doc(this.theSquad.id_squad).collection("Integrantes").valueChanges().subscribe(miembros => {
      this.members = [];
      let found = false;
      for (const member of miembros)
      {
        if (member.persona_id == this.mymail)
        {
          found = true;
        }
      }
      if (found)
      {
        for (const person of miembros) {
          this.userService.downloadFile(person.foto_perfil).subscribe(data => {
            let objectURL = 'data:image/png;base64,' + data;
            let imagen = this.sanitizer.bypassSecurityTrustUrl(objectURL);
            this.members.push([person, imagen]);
            }, error => console.log(error));
        }
      }
      else{
        this.router.navigate(['squads']);
        alert("Haz sido echado del squad.");
      }
    });
  }

  getFriends(){
    this.personService.getFriends(sessionStorage.getItem('mail')).subscribe(
      (personas: Person[]) => {
       for (const person of personas) {
          let found = false;
          for (const member of this.theSquad.integrantes)
          {
            if (person.persona_id == member.persona_id)
            {
              found = true;
            }
          }
          if (!found)
          {
          this.userService.downloadFile(person.foto_perfil).subscribe(data => {
            let objectURL = 'data:image/png;base64,' + data;
            let imagen = this.sanitizer.bypassSecurityTrustUrl(objectURL);
            this.myFriends.push([person, imagen]);
          }, error => console.log(error));
         }
        }
      });
  }

  inviteFriend(p: Person){
    let inviteList: string[] = [];
    inviteList.push(p.persona_id);
    this.squadService.sendInvitations(inviteList, this.theSquad.nombre, this.theSquad.id_squad).subscribe();
    this.eventMessage = 'Se ha invitado a ' + p.nombre_usuario;
  }

  getColorByPerson(p: Person){
    return this.colors[this.members.indexOf(p)];
  }

  getImageByMail(mail:string)
  {
    for (const member of this.members) {
      if (mail == member[0].persona_id)
      {
        return member[1];
      }
    }
  }

  getColorByMail(mail: string){
    for (const member of this.members) {
      if (mail == member[0].persona_id)
      {
        return this.colors[this.members.indexOf(member)];
      }
    }
  }

  getPhoto(){
    this.userService.downloadFile(this.theSquad.imagen).subscribe(data => {
      let objectURL = 'data:image/png;base64,' + data;
      let imagen = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      this.squadPhoto = imagen;
    })
  }

  getChat(){
    this.afStore.collection('Chat').doc(this.theSquad.chat_id).collection("Mensajes").valueChanges().subscribe(chat => {
      this.chatService.getChatById(this.theSquad.chat_id).subscribe( data => {
        this.messages = data.mensajes;
        this.scrolltop = this.scroll.nativeElement.scrollHeight;
      });
    });
  }

  sendMessage(){
    var date = new Date();
    this.mensajeNuevoFull = new Mensaje(this.theSquad.chat_id, this.mymail, date.getTime().toString(), this.messageSend.mensaje);
    this.chatService.sendMessage(this.mensajeNuevoFull, this.theSquad.chat_id).subscribe(funciono =>{
      this.messageSend.mensaje = '';
    });
  }

  leaveSquad()
  {
    try{
      this.squadService.leaveSquad(this.theSquad).subscribe(data => {
        this.router.navigate(['squads']);
      });
    }catch {
      console.log("No se pudo salir");
    }
  }

  kickFromSquad(member: any )
  {
    try{
      this.squadService.kickFromSquad(member, this.theSquad).subscribe();
    }catch {
      console.log('No se ha podido botar');
    }
  }

  scrollToBottom() {
    this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
  }

  updateSquad(){
    if (this.fileToUpload != null)
    {
      let name = `Squads/`+Date.now()+"-"+this.fileToUpload.name;
      this.storage.upload(name, this.fileToUpload);
      this.theSquad.nombre = this.newName;
      this.theSquad.imagen = name;
      this.resetImage();
      this.squadService.updateSquad(this.theSquad).subscribe(resultSquad => {});
    }
    else{
      this.theSquad.nombre = this.newName;
      this.squadService.updateSquad(this.theSquad).subscribe(resultSquad => {});
    }
  }

  resetImage(){
    this.squadPhoto = this.imageSrc;
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

  go2call()
  {
    window.open('https://meet.jit.si/' + this.theSquad.id_squad + '#userInfo.displayName=\"' + this.myusername + '\"', 'blank_');
  }
}
