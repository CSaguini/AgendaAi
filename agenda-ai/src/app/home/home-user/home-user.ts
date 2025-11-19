import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Necessário pro *ngFor e interpolação
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { CardModule } from 'primeng/card'; // <-- PrimeNG Card
import { ButtonModule } from 'primeng/button'; // <-- PrimeNG Button
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Secao } from '../secao/secao';
import { FormsModule } from '@angular/forms';
import { Chatbot } from '../../chatbot/chatbot';

@Component({
  selector: 'app-home-user',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule, // habilita *ngFor, *ngIf, etc
    Navbar,
    Footer,
    CardModule, // habilita <p-card>
    ButtonModule,
    ProgressSpinnerModule,
    Secao,
    FormsModule, 
    Chatbot
  ] ,
  templateUrl: './home-user.html'
})
export class HomeUser implements OnInit {
  empresas: any[] = [];
  loading = true; // controla estado de carregamento
  searchTerm: string = '';
  filteredEmpresas: any[] = [];
  private baseUrl = 'http://localhost:3000/entrepreneur/entreprenuers';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private router: Router) { }
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

searchEmpresas() {
  const term = this.searchTerm.toLowerCase().trim();

  // Se o campo estiver vazio, mostra todas as empresas
  if (term === '') {
    this.filteredEmpresas = this.empresas;
    return;
  }

this.filteredEmpresas = this.empresas.filter(empresa => {
  const nome = (empresa?.nome || empresa?.name || '').toLowerCase();
  const cidade = (empresa?.cidade || '').toLowerCase();
  const estado = (empresa?.estado || '').toLowerCase();

  // Retorna empresas cujo nome, cidade ou estado incluam o termo
  return (
    nome.includes(term) ||
    cidade.includes(term) ||
    estado.includes(term)
  );
});

}

abrirPreScheduling(empresa: any) {
  if (!empresa || !empresa._id) {
    console.warn('Empresa inválida:', empresa);
    return;
  }

  this.router.navigate(['/establishment/pre-scheduling/', empresa._id]);
}


}