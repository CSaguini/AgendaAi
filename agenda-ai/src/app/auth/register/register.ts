import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';
import { NavbarAuth } from '../../shared/navbar-auth/navbar-auth';
import { Auth } from '../auth';
import { IRegister } from '../types/register.type';
import { Router } from '@angular/router';
import { Footer } from "../../shared/footer/footer";
import { RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    MessageModule,
    PasswordModule,
    NavbarAuth,
    Footer
  ],
  templateUrl: './register.html'
})
export class Register {
  messageService = inject(MessageService);
  registerForm: FormGroup;
  formSubmitted = false;

  constructor(private fb: FormBuilder, private authService: Auth, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      confirmPass: ['', [Validators.required]]
    });
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.registerForm.valid) {
      const register: IRegister = this.registerForm.value;
      try {
        this.authService.register(register).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Cadastro realizado',
              detail: 'Sua conta foi criada com sucesso!'
            });
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2500);
          },
          error: (data) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro no cadastro',
              detail: data?.error?.message
            });
          }
        });
      } catch {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro no cadastro',
          detail: 'Ocorreu um problema ao criar sua conta. Tente novamente.'
        });
      } finally {
        this.registerForm.reset();
        this.formSubmitted = false;
      }
    }
  }

  isInvalid(controlName: string) {
    const control = this.registerForm.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }
}

