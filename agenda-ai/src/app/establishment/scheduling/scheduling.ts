import { ServiceSchedulingService } from './../../services/serviceScheduling/serviceScheduling.service';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Auth } from '../../auth/auth';
import { NavbarAuth } from '../../shared/navbar-auth/navbar-auth';
import { Footer } from '../../shared/footer/footer';
import { DatePickerModule } from 'primeng/datepicker';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { format } from 'date-fns';

@Component({
  selector: 'app-scheduling',
  standalone: true,
  imports: [
    RouterLink, RouterLinkActive, NavbarAuth, Footer,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    DatePickerModule,
    CardModule,
    ButtonModule,
    DividerModule,
    ToastModule,
    ProgressSpinnerModule
  ],
  templateUrl: './scheduling.html',
  providers: [MessageService]
})
export class Scheduling implements OnInit {

  messageService = inject(MessageService);
  private route = inject(ActivatedRoute);
  private authService = inject(Auth);

  user_id: string;
  services_entreprenuer!: string;

  loading: boolean = true;

  // estrutura esperada do backend: [{ data: 'YYYY-MM-DD', horarios_disponiveis: ['HH:MM', ...] }, ...]
  disponibilidadeGeral: Array<{ data: string, horarios_disponiveis: string[] }> = [];
  datasDisponiveis: Date[] = [];

  dataSelecionada: Date | null = null;
  horariosDoDia: string[] = [];

  horarioSelecionado: string | null = null;

  schedulingRegisterForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private serviceSchedulingService: ServiceSchedulingService
  ) {

    const loggedInId = this.authService.getLoggedInUserId?.();
    this.user_id = loggedInId ?? '';

    this.schedulingRegisterForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', Validators.required],
      descricao: [''],
      imagem: [''],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const serviceId = params.get('serviceId');
      if (serviceId) {
        this.services_entreprenuer = serviceId;
        this.carregarDisponibilidade();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'ID do serviço não encontrado.' });
        this.loading = false;
      }
    });
  }

  // PrimeNG date template fornece { year, month, day } ou Date dependendo do uso.
  // Aqui tratamos o caso do objeto {year,month,day} — se o seu p-datepicker fornecer Date diretamente, isso também funciona em onDiaSelecionado.
  isDateAvailable(date: any): boolean {
    // Se for Date object (quando p-datepicker usa Date), adaptar:
    let jsDate: Date;
    if (date instanceof Date) {
      jsDate = date;
    } else {
      // PrimeNG costuma enviar month 0-indexed ou 1-indexed dependendo da versão/settings.
      // Este cálculo assume month 0-indexed (0 = Jan). Se aparecer um mês errado, troque para (date.month - 1).
      jsDate = new Date(date.year, date.month, date.day);
    }

    const formatted = format(jsDate, 'yyyy-MM-dd');
    return this.disponibilidadeGeral.some(d => d.data === formatted);
  }

  carregarDisponibilidade(): void {
    this.loading = true;

    // Uso de 'any' no cast: evita erro caso o Service use outro nome/tipo.
    const svc: any = this.serviceSchedulingService as any;

    // ajuste: se seu service efetivamente tem getDisponibilidade, ótimo — ele será chamado.
    // se tiver outro nome, substitua a chamada abaixo pelo nome correto do método do seu service.
    const obs = svc.getDisponibilidade
      ? svc.getDisponibilidade(this.services_entreprenuer)
      : (svc.getAvailableTimes ? svc.getAvailableTimes(this.services_entreprenuer) : null);

    if (!obs) {
      console.error('ServiceSchedulingService não expõe getDisponibilidade nem getAvailableTimes. Ajuste o service ou altere esta chamada.');
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Serviço de disponibilidade não encontrado.' });
      this.loading = false;
      return;
    }

    obs.subscribe({
      next: (data: any) => {
        // espera array: [{ data: 'YYYY-MM-DD', horarios_disponiveis: [...] }, ...]
        this.disponibilidadeGeral = Array.isArray(data) ? data : [];
        this.datasDisponiveis = this.disponibilidadeGeral.map(d => new Date(d.data + 'T00:00:00'));
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erro carregar disponibilidade', error);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar disponibilidade.' });
        this.loading = false;
      }
    });
  }

  // onSelect do datepicker fornece um Date object
  onDiaSelecionado(selected: Date): void {
    this.dataSelecionada = selected;
    this.horarioSelecionado = null;

    if (!this.dataSelecionada) return;

    const dataFormatada = format(this.dataSelecionada, 'yyyy-MM-dd');
    const diaEncontrado = this.disponibilidadeGeral.find(d => d.data === dataFormatada);
    console.log(dataFormatada)
    console.log(diaEncontrado)
    this.horariosDoDia = diaEncontrado ? diaEncontrado.horarios_disponiveis : [];

    if (!this.horariosDoDia || this.horariosDoDia.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Nenhum horário disponível neste dia.' });
    }
  }

  selecionarHorario(horario: string): void {
    this.horarioSelecionado = horario;
  }

  RegisterScheduling(): void {
    if (this.schedulingRegisterForm.invalid || !this.dataSelecionada || !this.horarioSelecionado) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Preencha todos os campos e selecione data e horário.' });
      return;
    }

    this.loading = true;

    const dataStr = format(this.dataSelecionada, 'yyyy-MM-dd');
    const isoStr = `${dataStr}T${this.horarioSelecionado}:00`;
    const dataISO = new Date(isoStr);

    const payload: any = {
      user_id: this.user_id,
      services_entreprenuer: this.services_entreprenuer,
      data_agendamento_iso: dataISO,
      // incluir campos do form se quiser que o backend receba
      Name: this.schedulingRegisterForm.value.name,
      age: this.schedulingRegisterForm.value.age,
      descricao: this.schedulingRegisterForm.value.descricao,
      imagem: this.schedulingRegisterForm.value.imagem
    };

    const svc: any = this.serviceSchedulingService as any;
    const createObs = svc.criarAgendamento ? svc.criarAgendamento(payload) : (svc.createScheduling ? svc.createScheduling(payload) : null);

    if (!createObs) {
      console.error('ServiceSchedulingService não expõe criarAgendamento nem createScheduling. Ajuste o service ou altere esta chamada.');
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Serviço de criação de agendamento não encontrado.' });
      this.loading = false;
      return;
    }

    createObs.subscribe({
      next: (res: any) => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Agendamento realizado!' });
        this.schedulingRegisterForm.reset();
        this.dataSelecionada = null;
        this.horarioSelecionado = null;
        this.carregarDisponibilidade();
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Erro ao criar agendamento', err);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error?.message || 'Erro ao tentar agendar.' });
        this.loading = false;
      }
    });
  }
}
