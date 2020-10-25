import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PresentationComponent } from './Login/presentation/presentation.component';
import { LoginComponent } from './Login/login/login.component';
import { RegisterComponent } from './Login/register/register.component';
import { ProfileComponent } from './Profile/profile/profile.component';
import { EditProfileComponent } from './Profile/edit-profile/edit-profile.component';
import { FriendProfileComponent } from './Profile/friend-profile/friend-profile.component';
import { FeedComponent } from './feed/feed.component';
import { MainSearchComponent } from './search/main-search/main-search.component';
import { PublicacionesSearchComponent } from './search/publicaciones-search/publicaciones-search.component';
import { VideojuegosSearchComponent } from './search/videojuegos-search/videojuegos-search.component';
import { AdminProfileComponent } from './Profile/admin-profile/admin-profile.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ChatComponent } from './chat/chat.component';
import { GuardAccesGuard } from '../../guard/guard-acces.guard';


const routes: Routes = [
  {path: 'presentation', component: PresentationComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'editar', component: EditProfileComponent},
  {path: 'profile/:id', component: FriendProfileComponent},
  {path: 'feed', component: FeedComponent},
  {path: 'main-search', component: MainSearchComponent},
  {path: 'publication-search', component: PublicacionesSearchComponent},
  {path: 'videogame-search', component: VideojuegosSearchComponent},
  {path: 'chat', component: ChatComponent, canActivate: [GuardAccesGuard]},
  {path: 'feedAdmin', component: AdminProfileComponent},
  {path: '', pathMatch: 'full', redirectTo: 'presentation' },
  {path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
