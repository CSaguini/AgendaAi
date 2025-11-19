import { Component, inject, OnInit,ChangeDetectorRef } from '@angular/core';
import { NavbarAdm } from '../navbar-adm/navbar-adm'; 
import { Footer } from '../../shared/footer/footer';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card'; // <-- PrimeNG Card
import { ButtonModule } from 'primeng/button'; // <-- PrimeNG Button
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-users',
  imports: [NavbarAdm, Footer,
    CommonModule,
    ButtonModule,
    ProgressSpinnerModule,
    CommonModule
  ],
  templateUrl: './users.html',
  providers: [MessageService]
})
export class Users {
  messageService = inject(MessageService)
  users: any[] = [] ;
  loading = true; 

  constructor( private cdr: ChangeDetectorRef, private http: HttpClient) { }

    async ngOnInit() {
      await this.loadUser()
    }

    async loadUser() {
      try {
        const data = await firstValueFrom(
          this.http.get<any[]>('http://localhost:3000/user/all')
        );
  
        console.log('Resposta da API:', data);   
         // garante que sempre será um array
        this.users = data ?? [];
  
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        this.users = [];
      } finally {
        this.loading = false;
        this.cdr.detectChanges();
      }
    }

     alterarStatus(id: string, status: boolean) {
 this.http.patch(`http://localhost:3000/api/user/status/${id}`, { isActive: status }).subscribe({
    next: () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: status ? 'Usuario ativada!' : 'Empresa inativada!'
      });
      this.loadUser(); // recarrega a lista
    },
    error: () => {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível alterar o status.'
      });
    }
  });
}
}
