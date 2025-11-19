import { Component , ChangeDetectorRef, type OnInit} from '@angular/core';
import { inject } from '@angular/core';
import { Establishment } from '../../establishment/establishment';
import { CommonModule } from '@angular/common';
import { NavbarAdm } from '../navbar-adm/navbar-adm';
import { Footer } from '../../shared/footer/footer';
import { CardModule } from 'primeng/card'; // <-- PrimeNG Card
import { ButtonModule } from 'primeng/button'; // <-- PrimeNG Button
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Auth } from '../../auth/auth';

@Component({
  selector: 'app-companies',
  imports: [NavbarAdm, Footer, 
    CommonModule,  
    CardModule, // habilita <p-card>
    ButtonModule,
    ProgressSpinnerModule,
    RouterLink,
    RouterLinkActive,
    ConfirmDialog,
    ToastModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './companies.html'
})
export class Companies implements OnInit{
  empresas: any[] = [];
  loading = true;
 private messageService = inject(MessageService);
 
 constructor(private http: HttpClient, private cdr: ChangeDetectorRef ) { }
  async ngOnInit() {
    await this.loadEntreprenuers()
  }

    async loadEntreprenuers() {
    try {
      const data = await firstValueFrom(
        this.http.get<{empresas: any[]}>('http://localhost:3000/entrepreneur/entreprenuers')
      );

      console.log('Resposta da API:', data);

      // garante que sempre será um array
      this.empresas = data?.empresas ?? [];

    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
      this.empresas = [];
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  alterarStatus(id: string, status: boolean) {
 this.http.patch(`http://localhost:3000/api/entrepreneur/status/${id}`, { isActive: status }).subscribe({
    next: () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: status ? 'Empresa ativada!' : 'Empresa inativada!'
      });
      this.loadEntreprenuers(); // recarrega a lista
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


