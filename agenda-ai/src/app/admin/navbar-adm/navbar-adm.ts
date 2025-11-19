import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import  { Auth } from '../../auth/auth';


@Component({
  selector: 'app-navbar-adm',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar-adm.html',

})
export class NavbarAdm {

constructor(private authService: Auth, private router: Router) {}
logout() {
  this.authService.logout();
  this.router.navigate(['/login']); // Redireciona para a tela de login
}
}
