import { Component } from '@angular/core';
import { NavbarAuth } from '../../shared/navbar-auth/navbar-auth';
import { Footer } from "../../shared/footer/footer";
import { ActivatedRoute } from '@angular/router';
import { Auth } from '../auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  // <--- IMPORTANTE

@Component({
  selector: 'app-new-password',
  imports: [NavbarAuth, Footer, FormsModule, CommonModule],
  templateUrl: './new-password.html'
})
export class NewPassword {

  id: string | null = null;
  token: string | null = null;
  newPassword: string = "";
  confirmPassword: string = "";
  mensagem: string = "";

  constructor(
    private route: ActivatedRoute,
    private auth: Auth
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
    this.token = this.route.snapshot.paramMap.get("token");
    console.log("ID:", this.id);
    console.log("Token:", this.token);
  }

  resetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.mensagem = "As senhas não coincidem!";
      return;
    }

    this.auth.resetPassword(this.id!, this.token!, this.newPassword).subscribe({
      next: () => this.mensagem = "Senha alterada com sucesso!",
      error: () => this.mensagem = "Erro ao redefinir senha."
    });
  }
}
