import { Component , inject, OnInit, ChangeDetectorRef} from '@angular/core';
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
  selector: 'app-complaints',
  imports: [NavbarAdm, Footer,
    CommonModule,
    ButtonModule,
    ProgressSpinnerModule,
    CommonModule], 
  templateUrl: './complaints.html',
  providers: [MessageService]
})
export class Complaints {
  messageService = inject(MessageService)
  contato: any [] = [];
  loading = true; 

  constructor( private cdr: ChangeDetectorRef, private http: HttpClient) { }

    async ngOnInit() {
      await this.loadContato()
    }

    async loadContato() {
      try {
        const data = await firstValueFrom(
          this.http.get<any[]>('http://localhost:3000/contato')
        );
  
        console.log('Resposta da API:', data);   
         // garante que sempre será um array
        this.contato = data ?? [];
  
      } catch (error) {
        console.error('Erro ao buscar contatos:', error);
        this.contato = [];
      } finally {
        this.loading = false;
        this.cdr.detectChanges();
      }
    } 
}
