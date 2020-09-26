import { Component, DoCheck } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements DoCheck{
  gamerTag: string = "StormyFiddle";
  title = 'matchmakingfrontend';
  show: boolean;

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
}
