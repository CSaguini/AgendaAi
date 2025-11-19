import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { InputMaskModule } from 'primeng/inputmask';
import { Footer } from '../../shared/footer/footer';
import { Establishment } from '../establishment';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ViacepService } from '../viacep';
import { NavbarAuth } from '../../shared/navbar-auth/navbar-auth';
interface State {
  name: string;
  value: string;
}

@Component({
  selector: 'app-entrepreneur-register',
  standalone: true,
  imports: [
    NavbarAuth,
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    FileUploadModule,
    CheckboxModule,
    ToastModule,
    InputMaskModule,
    Footer,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './register.html',
  providers: [MessageService]
})
export class Register {

  private http = inject(HttpClient)

  messageService = inject(MessageService);
  fb = inject(FormBuilder);

  entrepreneurRegisterForm: FormGroup;
  states: State[] = [
    { name: 'Acre', value: 'AC' },
    { name: 'Alagoas', value: 'AL' },
    { name: 'Amapá', value: 'AP' },
    { name: 'Amazonas', value: 'AM' },
    { name: 'Bahia', value: 'BA' },
    { name: 'Ceará', value: 'CE' },
    { name: 'Distrito Federal', value: 'DF' },
    { name: 'Espírito Santo', value: 'ES' },
    { name: 'Goiás', value: 'GO' },
    { name: 'Maranhão', value: 'MA' },
    { name: 'Mato Grosso', value: 'MT' },
    { name: 'Mato Grosso do Sul', value: 'MS' },
    { name: 'Minas Gerais', value: 'MG' },
    { name: 'Pará', value: 'PA' },
    { name: 'Paraíba', value: 'PB' },
    { name: 'Paraná', value: 'PR' },
    { name: 'Pernambuco', value: 'PE' },
    { name: 'Piauí', value: 'PI' },
    { name: 'Rio de Janeiro', value: 'RJ' },
    { name: 'Rio Grande do Norte', value: 'RN' },
    { name: 'Rio Grande do Sul', value: 'RS' },
    { name: 'Rondônia', value: 'RO' },
    { name: 'Roraima', value: 'RR' },
    { name: 'Santa Catarina', value: 'SC' },
    { name: 'São Paulo', value: 'SP' },
    { name: 'Sergipe', value: 'SE' },
    { name: 'Tocantins', value: 'TO' }
  ];

  constructor(private establishmentService: Establishment, private router: Router, private viacepService: ViacepService) {
    this.entrepreneurRegisterForm = this.fb.group({
      name: ['', Validators.required],
      cpf: ['', Validators.required],
      telefone: ['', Validators.required],
      cep: ['', Validators.required],
      rua: ['', Validators.required],
      numero: ['', Validators.required],
      comple: [''],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      termos: [false, Validators.requiredTrue]
    });

  }

  buscarEndereco() {
    const cep = this.entrepreneurRegisterForm.get('cep')?.value
    console.log(cep)
    if(cep) {
      this.viacepService.buscarCEP(cep).subscribe((endereco) => {
        if(!("erro" in endereco)) {
          this.entrepreneurRegisterForm.patchValue({
            bairro: endereco.bairro,
            rua: endereco.logradouro,
            cidade: endereco.localidade,
          })
        } else {
          this.messageService.add({ severity: 'warning', summary: 'Atenção', detail: 'CEP não encontrado!'})
        }
      })
    }
  }

  registerEntrepreneur() {
    if (this.entrepreneurRegisterForm.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Preencha todos os campos obrigatórios' });
      return;
    }

    this.establishmentService.register(this.entrepreneurRegisterForm.value).subscribe({
      next: (data: any) => {
        console.log(data)
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cadastro realizado com sucesso!' });
        this.entrepreneurRegisterForm.reset();
        this.router.navigate(['/establishment/profile'])
      },
      error: (data: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro no cadastro',
          detail: data?.error?.message
        });
      }
    })
  }

  clearForm() {
    this.entrepreneurRegisterForm.reset();
  }
}