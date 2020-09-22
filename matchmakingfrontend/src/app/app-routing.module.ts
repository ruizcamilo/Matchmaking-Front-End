import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PresentationComponent } from './Login/presentation/presentation.component';
import { LoginComponent } from './Login/login/login.component';
import { RegisterComponent } from './Login/register/register.component';
import { ProfileComponent } from './Profile/profile/profile.component';

const routes: Routes = [
  {path: 'presentation', component: PresentationComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'profile', component: ProfileComponent},
  {path: '', pathMatch: 'full', redirectTo: 'presentation' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
