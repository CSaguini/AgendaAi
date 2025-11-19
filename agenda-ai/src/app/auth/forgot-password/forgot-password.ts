import { Component } from '@angular/core';
import { NavbarAuth } from '../../shared/navbar-auth/navbar-auth';
import { Footer } from "../../shared/footer/footer";
import { RouterLink } from '@angular/router';
import { Auth } from '../auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  imports: [NavbarAuth, Footer, RouterLink, FormsModule, CommonModule],
  templateUrl: './forgot-password.html'
})
export class ForgotPassword {

  email: string = "";
  mensagem: string = "";

  constructor(private auth: Auth) {}

  enviarEmail() {
    this.auth.requestResetPassword(this.email).subscribe({
      next: () => {
        this.mensagem = "Email enviado! Verifique sua caixa de entrada.";
      },
      error: err => {
        if (err.status === 404) {
          this.mensagem = "Email não cadastrado.";
        } else {
          this.mensagem = "Erro ao enviar email.";
        }
      }
    });
  }
}
