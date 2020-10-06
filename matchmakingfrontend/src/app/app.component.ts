import { Component, DoCheck } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements DoCheck{
  gamerTag: string = "StormyFiddle";
  title = 'matchmakingfrontend';
  search: string;
  show: boolean;

  constructor(private router: Router) {
  }

  ngDoCheck(): void {
    //Called every time that the input properties of a component or a directive are checked. Use it to extend change detection by performing a custom check.
    //Add 'implements DoCheck' to the class.
    if (sessionStorage.getItem("gamertag") === null)
    {
      this.show = false;
    }else{
      this.gamerTag = sessionStorage.getItem("gamertag");
      this.show = true;
    }
  }
  logout() {
    sessionStorage.clear();
  }

  goSearch(){
    if(!this.search)
    {
      alert("Ingresa algo noob");
    }
    else{
      this.router.navigate(['/main-search', { search: this.search }]);
    }
  }
}
