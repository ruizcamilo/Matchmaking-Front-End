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
import { ClanesSearchComponent } from './search/clanes-search/clanes-search.component';
import { AdminProfileComponent } from './Admin/admin-profile/admin-profile.component';
import { AdminPostReportedComponent } from './Admin/admin-post-reported/admin-post-reported.component';
import { AdminUsersReportedComponent } from './Admin/admin-users-reported/admin-users-reported.component';
import { AdminVideoGamesComponent } from './Admin/admin-video-games/admin-video-games.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ChatComponent } from './chat/chat.component';
import { ClanComponent } from './Clan/clan/clan.component';
import { GuardAccesGuard } from '../../guard/guard-acces.guard';
import { FeedSquadsComponent } from './squads/feed-squads/feed-squads.component';
import { CreateSquadComponent } from './squads/create-squad/create-squad.component';
import { SquadViewComponent } from './squads/squad-view/squad-view.component';
import { RecoverPasswordComponent } from './Login/recover-password/recover-password.component';
import { MatchmakingComponent } from './matchmaking/matchmaking/matchmaking.component';


const routes: Routes = [
  {path: 'presentation', component: PresentationComponent},
  {path: 'login', component: LoginComponent},
  {path: 'recover-password', component: RecoverPasswordComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'editar', component: EditProfileComponent},
  {path: 'profile/:id', component: FriendProfileComponent},
  {path: 'feed', component: FeedComponent},
  {path: 'main-search', component: MainSearchComponent},
  {path: 'publication-search', component: PublicacionesSearchComponent},
  {path: 'videogame-search', component: VideojuegosSearchComponent},
  {path: 'clan-search', component: ClanesSearchComponent},
  {path: 'chat', component: ChatComponent, canActivate: [GuardAccesGuard]},
  {path: 'feedAdmin', component: AdminProfileComponent},
  {path: 'userReported', component: AdminUsersReportedComponent},
  {path: 'postReported', component: AdminPostReportedComponent},
  {path: 'videoGames', component: AdminVideoGamesComponent},
  {path: 'clans/:id', component: ClanComponent},
  {path: 'squads', component: FeedSquadsComponent, canActivate: [GuardAccesGuard]},
  {path: 'create-squad', component: CreateSquadComponent, canActivate: [GuardAccesGuard]},
  {path: 'squad-view', component: SquadViewComponent},
  {path: '', pathMatch: 'full', redirectTo: 'presentation' },
  {path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
