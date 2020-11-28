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
import { GuardAccesGuard } from './guard/guard-acces.guard';
import { AdminAccessGuard } from './guard/admin-access.guard'
import { FeedSquadsComponent } from './squads/feed-squads/feed-squads.component';
import { CreateSquadComponent } from './squads/create-squad/create-squad.component';
import { SquadViewComponent } from './squads/squad-view/squad-view.component';
import { RecoverPasswordComponent } from './Login/recover-password/recover-password.component';
import { MatchmakingComponent } from './matchmaking/matchmaking/matchmaking.component';
import { NewAccessGuardGuard } from './guard/new-access-guard.guard';


const routes: Routes = [
  {path: 'presentation', component: PresentationComponent, canActivate: [NewAccessGuardGuard]},
  {path: 'login', component: LoginComponent, canActivate: [NewAccessGuardGuard]},
  {path: 'recover-password', component: RecoverPasswordComponent, canActivate: [NewAccessGuardGuard]},
  {path: 'register', component: RegisterComponent, canActivate: [NewAccessGuardGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [GuardAccesGuard]},
  {path: 'editar', component: EditProfileComponent, canActivate: [GuardAccesGuard]},
  {path: 'profile/:id', component: FriendProfileComponent, canActivate: [GuardAccesGuard]},
  {path: 'feed', component: FeedComponent, canActivate: [GuardAccesGuard]},
  {path: 'main-search', component: MainSearchComponent, canActivate: [GuardAccesGuard]},
  {path: 'publication-search', component: PublicacionesSearchComponent, canActivate: [GuardAccesGuard]},
  {path: 'videogame-search', component: VideojuegosSearchComponent, canActivate: [GuardAccesGuard]},
  {path: 'clan-search', component: ClanesSearchComponent, canActivate: [GuardAccesGuard]},
  {path: 'chat', component: ChatComponent, canActivate: [GuardAccesGuard]},
  {path: 'feedAdmin', component: AdminProfileComponent, canActivate: [AdminAccessGuard]},
  {path: 'userReported', component: AdminUsersReportedComponent, canActivate: [AdminAccessGuard]},
  {path: 'postReported', component: AdminPostReportedComponent, canActivate: [AdminAccessGuard]},
  {path: 'videoGames', component: AdminVideoGamesComponent, canActivate: [AdminAccessGuard]},
  {path: 'clans/:id', component: ClanComponent, canActivate: [GuardAccesGuard]},
  {path: 'matchmaking', component: MatchmakingComponent, canActivate: [GuardAccesGuard]},
  {path: 'squads', component: FeedSquadsComponent, canActivate: [GuardAccesGuard]},
  {path: 'create-squad', component: CreateSquadComponent, canActivate: [GuardAccesGuard]},
  {path: 'squad-view', component: SquadViewComponent, canActivate: [GuardAccesGuard]},
  {path: '', pathMatch: 'full', redirectTo: 'feed' },
  {path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
