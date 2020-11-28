import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PresentationComponent } from './Login/presentation/presentation.component';
import { LoginComponent } from './Login/login/login.component';
import { RegisterComponent } from './Login/register/register.component';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ProfileComponent } from './Profile/profile/profile.component';
import { HttpClientModule } from '@angular/common/http';
import { EditProfileComponent } from './Profile/edit-profile/edit-profile.component';
import { FriendProfileComponent } from './Profile/friend-profile/friend-profile.component';
import { FeedComponent } from './feed/feed.component';
import { MainSearchComponent } from './search/main-search/main-search.component';
import { PublicacionesSearchComponent } from './search/publicaciones-search/publicaciones-search.component';
import { VideojuegosSearchComponent } from './search/videojuegos-search/videojuegos-search.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NotFoundComponent } from './not-found/not-found.component';
import { ChatComponent } from './chat/chat.component';
import { GuardAccesGuard } from './guard/guard-acces.guard';
import { AdminAccessGuard } from './guard/admin-access.guard';
import { AdminProfileComponent } from './Admin/admin-profile/admin-profile.component';
import { AdminPostReportedComponent } from './Admin/admin-post-reported/admin-post-reported.component';
import { AdminUsersReportedComponent } from './Admin/admin-users-reported/admin-users-reported.component';
import { AdminVideoGamesComponent } from './Admin/admin-video-games/admin-video-games.component';
import { ClanComponent } from './Clan/clan/clan.component';
import { ClanesSearchComponent } from './search/clanes-search/clanes-search.component';
import { FeedSquadsComponent } from './squads/feed-squads/feed-squads.component';
import { CreateSquadComponent } from './squads/create-squad/create-squad.component';
import { SquadViewComponent } from './squads/squad-view/squad-view.component';
import { RecoverPasswordComponent } from './Login/recover-password/recover-password.component';
import { MatchmakingComponent } from './matchmaking/matchmaking/matchmaking.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { NewAccessGuardGuard } from './guard/new-access-guard.guard';

@NgModule({
  declarations: [
    AppComponent,
    PresentationComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    EditProfileComponent,
    FriendProfileComponent,
    FeedComponent,
    MainSearchComponent,
    PublicacionesSearchComponent,
    VideojuegosSearchComponent,
    NotFoundComponent,
    ChatComponent,
    AdminProfileComponent,
    AdminPostReportedComponent,
    AdminUsersReportedComponent,
    AdminVideoGamesComponent,
    ClanComponent,
    ClanesSearchComponent,
    FeedSquadsComponent,
    CreateSquadComponent,
    SquadViewComponent,
    RecoverPasswordComponent,
    MatchmakingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    FormsModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    HttpClientModule,
    Ng2SearchPipeModule,
    NgbModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatInputModule
  ],
  providers: [GuardAccesGuard, AdminAccessGuard, NewAccessGuardGuard],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
