import { Component, inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Auth } from '../auth/auth';
import { Router } from '@angular/router';
import { Footer } from '../shared/footer/footer';
import { NavbarAuth } from "../shared/navbar-auth/navbar-auth";


@Component({
  selector: 'app-contact',  
  imports: [ReactiveFormsModule, Footer, NavbarAuth],
  templateUrl: './contact.html',
   providers: [MessageService]
})
export class Contact {
  messageService = inject(MessageService)

  contatoRegisterForm: FormGroup;

  formSubmitted = false;

  constructor(private fb: FormBuilder, private authService: Auth, private router: Router) {
    this.contatoRegisterForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      assunto: ['', Validators.required],
      mensagem: ['', [Validators.required]]
    });
  }

  resgiterContact() {
    if (this.contatoRegisterForm.valid) {
      const formData = this.contatoRegisterForm.value;
      this.authService.resgiterContact(formData).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Mensagem enviada com sucesso!' });
          this.contatoRegisterForm.reset();
          this.formSubmitted = false;
          this.router.navigate(['/home']);
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Ocorreu um erro ao enviar a mensagem. Tente novamente ' });
        }
      });
    }
  }
}
