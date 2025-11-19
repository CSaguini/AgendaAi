import { Footer } from './../../shared/footer/footer';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '../../auth/auth';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { TabsModule } from 'primeng/tabs';
import { FileUploadModule } from 'primeng/fileupload';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { NavbarAuth } from '../../shared/navbar-auth/navbar-auth';
Footer


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    NavbarAuth,
    CommonModule,
    FormsModule,
    Footer,
    CardModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    TabsModule,
    FileUploadModule,
    AvatarModule,
    DividerModule,
  ],
  templateUrl: './profile.html',

})
export class Profile implements OnInit {
  user: any = {
    name: '',
    surname: '',
    email: '',
    photo: '',
    schedulings: [],
  };

  token: string | null = null;
  logged = false;
  activeIndex = 0; // controla aba ativa

  constructor(private authService: Auth) {}

  ngOnInit(): void {
    const { user, token } = this.authService.getUserData();
    if (user) {
      this.user = { ...this.user, ...user };
      this.logged = !!token;
      this.token = token;
    }
  }

  salvarInfoPessoal() {
    console.log('Salvar informações pessoais', this.user);
    // TODO: implementar PUT na API para atualizar usuário
  }

  alterarSenha(senhaAtual: string, novaSenha: string, confirmarSenha: string) {
    console.log('Alterar senha', { senhaAtual, novaSenha, confirmarSenha });
    // TODO: implementar API de alteração de senha
  }

  alterarFoto(event: any) {
    const file = event.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.photo = e.target.result; // atualiza foto instantaneamente
      };
      reader.readAsDataURL(file);
    }
  }
}
