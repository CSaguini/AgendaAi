import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavbarAuth } from '../../shared/navbar-auth/navbar-auth';
import { Footer } from '../../shared/footer/footer';
import { RouterLink, RouterLinkActive, ActivatedRoute } from '@angular/router';
import { Auth } from '../../auth/auth';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pre-scheduling',
  standalone: true,
  imports: [
    NavbarAuth,
    Footer,
    RouterLink,
    RouterLinkActive,
    CommonModule
  ],
  templateUrl: './pre-scheduling.html'
})
export class PreScheduling implements OnInit {
  empresa: any = null;
  loading = true;
  getServicesEntreprenuer: any = null;
  logged = false; 
  selectedService: any = null;
  selectedServiceId: string | null = null;
  workingHours: any[] = [];
  userId: string | null = null;
  showForm: boolean = false;


  constructor(
    private auth: Auth,
    private router: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private http: HttpClient,
    private nav: Router   
  ) {}

  async ngOnInit(): Promise<void> {
    const id = this.router.snapshot.paramMap.get('id');
    console.log('ID da rota:', id);
    this.logged = true;
    await this.loadEntreprenuers(id);
    await this.loadServicesEntreprenuer(id);
    this.cdRef.detectChanges();

    const { user } = this.auth.getUserData();
    this.userId = user?._id;  // GUARDA O ID DO USUÁRIO

  }

  async loadServicesEntreprenuer(id: string | null) {
    this.loading = true;
    const { user } = this.auth.getUserData();
    try {
      this.http.get<any[]>(`http://localhost:3000/servicesEntreprenuer/getAll/${id}`)

        .subscribe({
          next: (result) => {
            this.getServicesEntreprenuer = result;
            this.loading = false;
            this.cdRef.detectChanges();
          },
          error: (error) => {
            console.error('Erro ao buscar serviços:', error);
            this.getServicesEntreprenuer = [];
            this.loading = false;
            this.cdRef.detectChanges();
          }
        });
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      this.getServicesEntreprenuer = [];
    } finally {
      this.loading = false;
      this.cdRef.detectChanges();
    }
  }

  async loadEntreprenuers(id: string | null) {
    this.loading = true;
    const { user } = this.auth.getUserData();
    try {
      this.http.get<any>(`http://localhost:3000/entrepreneur/entrepreneur/${id}`)
        .subscribe({
          next: (result) => {
            this.empresa = result[0] || [];
            this.loading = false;
            this.cdRef.detectChanges();
          },
          error: (error) => {
            console.error('Erro ao buscar empresa:', error);
            this.empresa = [];
            this.loading = false;
            this.cdRef.detectChanges();
          }
        });
    } catch (error) {
      console.error('Erro ao buscar empresa:', error);
      this.empresa = [];
    } finally {
      this.loading = false;
      this.cdRef.detectChanges();
    }
  }

agendar(service: any) {
  this.nav.navigate(['establishment/scheduling/', service._id, this.userId]);
}


}
