import { ServicesEntreprenuerService } from './../../services/servicesEntreprenuer/servicesEntreprenuer.service';
import { IServicesEntreprenuer } from './../../auth/types/services_entreprenuer.type';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { Auth } from '../../auth/auth';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Menubar, MenubarModule } from 'primeng/menubar';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { SpeedDialModule } from 'primeng/speeddial';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { Ripple } from 'primeng/ripple';
import { Dialog } from 'primeng/dialog';
import { Select } from 'primeng/select';
import { FormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Checkbox } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { FluidModule } from 'primeng/fluid';
import { NavbarAuth } from '../../shared/navbar-auth/navbar-auth';
import { ReactiveFormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-profile',
  imports: [
    ProgressSpinnerModule,
    ReactiveFormsModule,
    NavbarAuth,
    RouterLink,
    ButtonModule,
    Dialog,
    BadgeModule,
    CardModule,
    SpeedDialModule,
    MenubarModule,
    InputTextModule,
    Ripple,
    CommonModule,
    Menubar,
    RouterLink,
    Select,
    FormsModule,
    Checkbox,
    DatePickerModule,
    FluidModule
  ],
  templateUrl: './profile.html'
})

export class Profile implements OnInit {
  empresa: any = null;
  loading = true;
  getServicesEntreprenuer: any = null;
  daysOfWeek: any
  time: any
  initialDate: Date | undefined
  endDate: Date | undefined
  selectedDays: any
  selectedTime: any
  categories: string[] | undefined
  selectedCategory: string | undefined
  servicoSelecionado: any = null;     
  mostrarFormularioEdicao: boolean = false;
  public visible = false
  public logged = false;             // já inicializa com falso
  public user: any = {};
  public menuBarItems: MenuItem[] = [{ label: 'AgendaAI', icon: 'pi pi-home' }];
  public speedDialItems: MenuItem[] = [];
  public name = '';
  public primary_letter = '';
  public servicesEntreprenuer!: FormGroup;
  

  constructor(private auth: Auth, private router: Router, private cdRef: ChangeDetectorRef, private servicesEntreprenuerService: ServicesEntreprenuerService, private fb: FormBuilder, private http: HttpClient, ) { }
  
async ngOnInit(): Promise<void>  {

  // 1. Monta o form
  this.servicesEntreprenuer = this.fb.group({
    nome: ['', Validators.required],
    categoria: ['', Validators.required],
    descricao: ['', Validators.required],
    duracao: ['', Validators.required],
    time: [[], Validators.required],
    dias: [[], Validators.required]
  });

  // 2. Configurações iniciais fixas
  this.daysOfWeek = [
    { id: "monday", label: "Segunda-feira" },
    { id: "tuesday", label: "Terça-feira" },
    { id: "wednesday", label: "Quarta-feira" },
    { id: "thursday", label: "Quinta-feira" },
    { id: "friday", label: "Sexta-feira" },
    { id: "saturday", label: "Sábado" },
    { id: "sunday", label: "Domingo" },
  ];
  this.selectedDays = [this.daysOfWeek[1]];

  this.time = [
    {id: "6", label: "6:00" },
    {id: "7", label: "7:00" },
    {id: "8", label: "8:00" },
    {id: "9", label: "9:00" },
    {id: "10", label: "10:00" },
    {id: "11", label: "11:00" },
    {id: "12", label: "12:00" },
    {id: "13", label: "13:00" },
    {id: "14", label: "14:00" },
    {id: "15", label: "15:00" },
    {id: "16", label: "16:00" },
    {id: "17", label: "17:00" },
    {id: "18", label: "18:00" },
    {id: "19", label: "19:00" },
    {id: "20", label: "20:00" },
    {id: "21", label: "21:00" },
    {id: "22", label: "22:00" },
  ];
  this.selectedTime = [this.time[1]];

  this.categories = [
    "Corte de Cabelo",
    "Coloração",
    "Tratamentos Capilares",
    "Manicure e Pedicure",
    "Depilação",
    "Limpeza de Pele",
    "Massagem",
    "Maquiagem",
    "Sobrancelhas",
    "Extensão de Cílios"
  ];

  // 3. Carrega user básico do token
  const { user, token } = this.auth.getUserData();

  if (!token || !user) {
    this.auth.logout();
    return;
  }

  this.logged = true;
  this.user = user;
  this.name = user.name ?? '';
  this.primary_letter = this.name.charAt(0);

  this.speedDialItems = [
    { label: 'Perfil', icon: 'pi pi-user', command: () => this.router.navigate(['/user/profile']) },
    { label: 'Config', icon: 'pi pi-cog', command: () => this.router.navigate(['/establishment/config']) },
    { label: 'Sair', icon: 'pi pi-sign-out', command: () => this.logout() }
  ];

  // 4. Agora busca usuário COMPLETO no backend (aqui o entrepreneur vem certo)
  this.auth.getUserById(user._id).subscribe({
    next: (updatedUser: any) => {

      this.user = updatedUser;

      if (!this.user?.entrepreneur) {
        this.router.navigate(['/establishment/register']);
        return;
      }

      // Agora sim: carregamos TUDO com o entrepreneur correto
      this.loadEntreprenuers();
      this.loadServicesEntreprenuer();

      this.name = this.user.name ?? this.name;
      this.primary_letter = this.name.charAt(0);

      this.cdRef.detectChanges();
    },
    error: (err) => {
      console.error("Erro ao buscar usuário:", err);
    }
  });
}


  showDialog() {
    this.visible = true
    this.cdRef.detectChanges()
  }

    editarServico(service:any){
      this.servicoSelecionado = service;
      this.mostrarFormularioEdicao = true; // exibe o form
    }
    
salvarEdicao() {
  this.servicesEntreprenuerService
    .updateService(this.servicoSelecionado._id, this.servicoSelecionado)
    .subscribe({
      next: () => {
        alert("Serviço atualizado com sucesso!");
        this.mostrarFormularioEdicao = false;
      },
      error: (err) => {
        console.error("Erro ao atualizar serviço:", err);
        alert("Ocorreu um erro ao atualizar o serviço.");
      },
    });
}

excluirServico(id: string) {
  if (confirm("Tem certeza que deseja excluir este serviço?")) {
    this.servicesEntreprenuerService.deleteService(id).subscribe({
      next: () => {
        alert("Serviço excluído com sucesso!");
        // Atualiza a lista automaticamente
        this.loadServicesEntreprenuer();
      },
      error: (err) => {
        console.error("Erro ao excluir serviço:", err);
        alert("Erro ao excluir o serviço.");
      }
    });
  }
}

  cancelarEdicao() {
    this.servicoSelecionado = null;
    this.mostrarFormularioEdicao = false;
  }
  
  logout() {
    this.auth.logout();
    window.location.reload();
  }

async registerServiceEntreprenuer() {
  try {
    if (this.servicesEntreprenuer.valid) {
    const servicesEntreprenuer: IServicesEntreprenuer = this.servicesEntreprenuer.value;
    const entreprenuerId = this.user.entrepreneur; 
    console.log("ID do empreendedor:", entreprenuerId);

    if (!entreprenuerId) {
      console.error("ID da empresa não encontrado!");
      return;
    }

    this.servicesEntreprenuerService.register(entreprenuerId, servicesEntreprenuer).subscribe({
      next: (data) => {
        console.log('Serviço criado', data);
        this.visible = false; // fecha o diálogo
        this.servicesEntreprenuer.reset(); // limpa formulário
      },
      error: (error) => console.log("Erro ao cadastrar serviço:", error)
    });
  } else {
    console.log("Formulário inválido");
    console.log(this.servicesEntreprenuer.valid);
    console.log(this.servicesEntreprenuer.value);
    console.log(this.servicesEntreprenuer.errors);
  }
  } catch (error) {
    console.log("Erro ao cadastrar serviço:", error);
  }
}

async loadServicesEntreprenuer() {
  this.loading = true;
  const { user } = this.auth.getUserData();
try {
    console.log("BATEU");
    this.http.get<any[]>(`http://localhost:3000/servicesEntreprenuer/getAll/${user?.entrepreneur}`)
    .subscribe({
      next: (result) => {
        this.getServicesEntreprenuer = result
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

    console.log('Empresa carregada:', this.getServicesEntreprenuer);
  } catch (error) {
    console.error('Erro ao buscar empresa:', error);
    this.getServicesEntreprenuer = [];
  } finally {
    this.loading = false;
    this.cdRef.detectChanges();
  }
}

async loadEntreprenuers() {
  this.loading = true;
  const { user } = this.auth.getUserData();

  try {
    console.log("BATEU");
    this.http.get<any>(`http://localhost:3000/entrepreneur/entrepreneur/${user?.entrepreneur}`)
    .subscribe({
      next: (result) => {
        console.log('Resultado da empresa:', result);
        this.empresa = result[0] || []; 
        console.log('Empresa carregada:', this.empresa);
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

    console.log('Empresa carregada:', this.empresa);
  } catch (error) {
    console.error('Erro ao buscar empresa:', error);
    this.empresa = [];
  } finally {
    this.loading = false;
    this.cdRef.detectChanges();
  }
}

}