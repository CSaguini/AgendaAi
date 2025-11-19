import { Component, ChangeDetectorRef } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Auth } from '../../auth/auth';
import { SpeedDialModule } from 'primeng/speeddial';
import type { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { Equipe } from '../../equipe/equipe';
import { MessageModule } from 'primeng/message';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-navbar',
  imports: [ButtonModule, RouterLink, RouterLinkActive, SpeedDialModule, CommonModule, Equipe, MessageModule, FormsModule],
  templateUrl: './navbar.html'
})
export class Navbar {
  public logged: any
  public user: any = {};
  public items: MenuItem[] = [];
  public name: string = '';
  public primary_letter: string = '';
  public token: string | null = null;

  constructor(private authService: Auth, private router: Router, private cdRef: ChangeDetectorRef) { }

  async ngOnInit() {
    await this.verifyAuth()
    console.log('Items no navbar:', this.items);
    this.cdRef.detectChanges()
  }

  async verifyAuth() {
    try {
      const { user, token } = this.authService.getUserData();
      this.user = user
      console.log(user)
      this.token = token;
      if (this.token && this.user?.name) {
        this.logged = true;
        this.name = this.user.name;
        this.primary_letter = this.name.charAt(0);
        this.items = [
          { label: 'Perfil', icon: 'pi pi-user', command: () => this.router.navigate(['/user/profile']) },
          { label: 'Empresa', icon: 'pi pi-briefcase', command: () => this.router.navigate(['/establishment/profile']) },
          { label: 'Sair', icon: 'pi pi-sign-out', command: () => this.logout() }
        ];
      } else {
        this.logged = false;
      }
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => this.cdRef.detectChanges());
    }
  }

  logout() {
    this.authService.logout();
    window.location.reload();
  }
}
