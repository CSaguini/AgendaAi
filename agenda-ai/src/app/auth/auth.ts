import { Scheduling } from './../establishment/scheduling/scheduling';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import type { ILogin } from './types/login.type';
import type { IRegister } from './types/register.type';
import type { IEntrepreneur } from './types/entrepreneur.type';
import type { IContato } from './types/contato.type';
import type { Ischeduling } from './types/scheduling.type';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private http = inject(HttpClient);
  public userLogged: any = null;
  public token: string | null = null;
  public isAuthenticated: boolean = false;
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private router = inject(Router);
  
  // Checks if the user is logged in
  private checkAuthentication(): void {
    const userData = localStorage.getItem('user_logged');
    const tokenData = localStorage.getItem('token');

    if (userData && tokenData) {
      try {
        this.userLogged = JSON.parse(userData);
        this.token = JSON.parse(tokenData);
        this.isAuthenticated = true;
      } catch (e) {
        console.error('Erro ao carregar dados do localStorage:', e);
        this.clearAuthData();
      }
    } else {
      this.clearAuthData();
    }
  }

  public getLoggedInUserId(): string | null {
    // 1. O código só deve rodar no navegador
    if (!this.isBrowser) {
      return null;
    }

    const userData = localStorage.getItem('user_logged');

    if (userData) {
      try {
        // 2. Faz o parse do JSON que foi salvo (ex: {"_id": "...", "email": "..."})
        const user = JSON.parse(userData);
        
        // 3. Retorna o ID (No MongoDB/Express, o campo é geralmente '_id' ou 'id')
        // Assumindo que o ID do usuário está no campo 'id' ou '_id' do objeto salvo.
        // Se a resposta da sua API for `user: {_id: '123'}`, use user._id
        if (user && user._id) { 
          return user._id as string; 
        }
        
      } catch (e) {
        console.error('Erro ao fazer parse dos dados do usuário para obter o ID:', e);
        return null;
      }
    }

    return null;
  }

  resgiterContact(contato: IContato): Observable<IContato> {
    return this.http.post<IContato>('http://localhost:3000/contato/register', contato);
  }

  resgisterEntrepreneur(entrepreneur: IEntrepreneur): Observable<IEntrepreneur> {
    return this.http.post<IEntrepreneur>('http://localhost:3000/entrepreneur/register', entrepreneur);
  }

  // Register a new user
  
  register(user: IRegister): Observable<IRegister> {
    return this.http.post<IRegister>('http://localhost:3000/user/register', user);
  }

  requestResetPassword(email: string) {
    return this.http.post('http://localhost:3000/user/requestpasswordreset', { email });
  }

  resetPassword(id: string, token: string, password: string) {
    return this.http.post(
      `http://localhost:3000/user/resetpassword?id=${id}&token=${token}`,
      { password }
    );
  }

  // Authenticate user
  authenticate(user: ILogin): Observable<any> {
    return this.http.post<any>('http://localhost:3000/user/login', user).pipe(
      tap((response) => {
          localStorage.setItem('token', JSON.stringify(response?.token));
          localStorage.setItem('user_logged', JSON.stringify(response?.user));
          this.userLogged = response;
          this.token = response.token;
          this.isAuthenticated = true;
          //this.router.navigate(['/cardtelas']);
      }),
      catchError((err) => {
        console.error('Erro durante autenticação:', err);
        this.clearAuthData();
        return err;
      })
    );
  }

  // Helper to clear authentication data
  private clearAuthData(): void {
    localStorage.removeItem('user_logged');
    localStorage.removeItem('token');
    this.userLogged = null;
    this.token = null;
    this.isAuthenticated = false;
  }

  getUserData(): any {
    this.checkAuthentication()
    return { user: this.userLogged, token: this.token };
  }

  getUserById(id: string) {
    return this.http.get<any>(`http://localhost:3000/user/get/${id}`).pipe(
      tap((response) => {
        if (response) {
          localStorage.setItem('user_logged', JSON.stringify(response));
          this.userLogged = response;
        }
      }),
    );
  }

  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/login']);
  }
}