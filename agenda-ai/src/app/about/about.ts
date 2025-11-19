import { Component } from '@angular/core';
import { Footer } from '../shared/footer/footer';
import { NavbarAuth } from "../shared/navbar-auth/navbar-auth";

@Component({
  selector: 'app-about',
  imports: [Footer, NavbarAuth],
  templateUrl: './about.html'
})
export class About {

}
