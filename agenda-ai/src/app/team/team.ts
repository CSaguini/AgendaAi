import { Component } from '@angular/core';
import { Footer } from '../shared/footer/footer';
import { RouterLink } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { NavbarAuth } from "../shared/navbar-auth/navbar-auth";
@Component({
  selector: 'app-team',
  imports: [Footer, RouterLink, SelectModule, NavbarAuth],
  templateUrl: './team.html'
})
export class Team {

}
