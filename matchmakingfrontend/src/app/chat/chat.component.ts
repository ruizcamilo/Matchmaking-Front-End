import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { ChatService } from '../service/chat.service';
import { Chat } from '../model/chat';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { Mensaje } from '../model/mensaje';
import { NgForm } from '@angular/forms';
import { PersonService } from '../service/person.service';
import { Person } from '../model/person';
import { UserService } from '../service/user.service';
import { User } from '../model/user';
import { stringify } from '@angular/compiler/src/util';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  mostrar: boolean = false;
  term: string = '';
  Owner: User;
  primeraVez: boolean = true;
  newChat: boolean = true;
  emailEntrante: string = null;
  mymail:string = '';
  channelList : Chat[] = [];
  displayIntegrantes : string;
  emailActual : string;
  exists: boolean;
  sizeIntegrantes : number;
  idFirstChat : string;
  messages : Mensaje [] = [];
  mensajeNuevo : string;
  mensajeNuevoFull : Mensaje;
  idCurrentChat: string;
  messageSend: Mensaje = new Mensaje("","","","");
  items = [];
  newItems = [];
  myObj = {};
  @ViewChild('scroll') scroll: ElementRef;
  scrolltop: number = null;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private afModule: AngularFireModule,
    private afAuth: AngularFireAuth ,
    private afStore: AngularFirestore,
    private chatService: ChatService,
    private personService: PersonService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.exists = true;
    this.mymail = sessionStorage.getItem('mail');
    this.route.params.subscribe(params => {
      console.log("ENTRO PAI");
      if (params['mail'] != null)
      {
        this.emailEntrante = params['mail'];
        if (this.emailEntrante == this.mymail)
        {
          console.log('es mi mail pai, no voy a crear nada');
          this.emailEntrante = null;
          this.router.navigate(['chat'], { queryParams: {}});
        }
        else{
          this.getProfile();
        }
      }
      else{
        this.getProfile();
      }
    });
  }
  callChats() {
    this.chatService.getChats().subscribe(async chat => {
      this.channelList = chat;

      this.idFirstChat = this.channelList[0].id;
      for (let chatAux of this.channelList){
        this.afStore.collection('Chat').doc(chatAux.id).collection("Mensajes").valueChanges().subscribe(chat => {
          if (this.primeraVez){
            this.primeraVez = false;
          } else {
            this.routingChat(chatAux.id);
          }
        });
      }
      if (this.emailEntrante == null)
      {
        this.chatService.getChatById(this.idFirstChat).subscribe(firstChat => {
          this.messages = firstChat.mensajes;
          this.scrolltop = this.scroll.nativeElement.scrollHeight;
        });
      }
      else{
          let newChat = new Chat([this.Owner.correo, this.emailEntrante],[],"","");
          this.chatService.createChat(newChat).subscribe(response => {
            this.router.navigate(['chat'], { queryParams: {}});
          });
        }
     });
  }

  mandarMensaje(){
    var date = new Date();
    this.mensajeNuevoFull = new Mensaje("654trgfd", this.emailActual, date.getTime().toString(), this.messageSend.mensaje);
    this.chatService.sendMessage(this.mensajeNuevoFull, this.idCurrentChat).subscribe(funciono =>{
      this.messageSend.mensaje = '';
    });
  }

  routingChat(id_chat: string){
    for(let chatAux of this.channelList){
      if(chatAux.id === id_chat){
        this.idCurrentChat = id_chat;
        this.chatService.getChatById(id_chat).subscribe( data => {
          this.messages = data.mensajes;
          this.scrolltop = this.scroll.nativeElement.scrollHeight;
        });
      }
    }
  }

  async getFriends(){
    this.personService.getFriends(this.Owner.correo).subscribe(
      (personas: Person[]) => {
      for (let index = 0; index < personas.length; index++) {
        console.log(personas[index].nombre_usuario);
        this.items.push({name: personas[index].nombre_usuario, email: personas[index].persona_id});
      }
      });
  }

  async getProfile(){
    try{
      this.userService.findByToken().subscribe
      ((user: User) => {
        this.Owner = user;
        this.emailActual = user.correo;
        this.getFriends();
        this.callChats();
      });
    } catch (error) {
      alert("Error en la base de datos");
    }
  }

  fillInputBar(namePlayer: string){
    this.term = namePlayer;
  }

  createChat(){
    let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (regexp.test(this.term))
    {
      let newChat = new Chat([this.Owner.correo, this.term], [], '', '');
      this.chatService.createChat(newChat).subscribe(data => {
        window.location.reload();
      });
    }
  }

  scrollToBottom() {
    this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
   }
}

