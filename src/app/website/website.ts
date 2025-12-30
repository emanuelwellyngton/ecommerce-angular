import { Component } from '@angular/core';
import { HeaderComponent } from "../shared/header/header";
import { RouterOutlet } from "@angular/router";
import { FooterComponent } from "../shared/footer/footer";

@Component({
  selector: 'app-website',
  imports: [HeaderComponent, RouterOutlet, FooterComponent],
  standalone: true,
  template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `,
  styles: ``,
})
export class Website {

}
