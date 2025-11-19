import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password'; // 👈 ADICIONADO AQUI
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Auth } from '../auth';
import { Footer } from '../../shared/footer/footer';
import { Navbar } from '../../shared/navbar/navbar';
import { NavbarAuth } from '../../shared/navbar-auth/navbar-auth';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    MessageModule,
    Footer,
    Navbar,
    RouterLink,
    RouterLinkActive,
    NavbarAuth,
    PasswordModule, // 👈 IMPORTADO AQUI TAMBÉM
  ],
  templateUrl: './login.html',
})
export class Login {
  messageService = inject(MessageService);

  loginForm: FormGroup;
  formSubmitted = false;

  constructor(private fb: FormBuilder, private router: Router, private authService: Auth) {
    this.loginForm = this.fb.group({
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.loginForm.valid) {
      const user: any = this.loginForm.value;
      try {
        this.authService.authenticate(user).subscribe({
          next: (data: any) => {
            console.log(data.user?.roles);
            if(data.user.roles.includes('admin')) {

              this.messageService.add({
                severity: 'success',
                summary: 'Login feito com sucesso',
                detail: 'Você entrou!',
              });
              this.router.navigate(['/admin/companies']);
            } else {
              this.messageService.add({
              severity: 'success',
              summary: 'Login feito com sucesso',
              detail: 'Você entrou!',
            });
            this.router.navigate(['/cardtelas']);
            }
          },
          error: (err) => {
            console.error('Erro no login:', err);

            // Captura mensagem vinda do backend, se existir
            const errorMsg = err?.error?.message || 'Usuário ou senha inválidos.';

            this.messageService.add({
              severity: 'error',
              summary: 'Erro no login',
              detail: errorMsg,
            });
          },
        });
      } catch (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro no login',
          detail: 'Ocorreu um problema ao tentar entrar. Tente novamente.',
        });
      } finally {
        this.loginForm.reset();
        this.formSubmitted = false;
      }
    }
  }

  isInvalid(controlName: string) {
    const control = this.loginForm.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }
}
