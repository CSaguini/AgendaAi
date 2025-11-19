import { Component, inject, type OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Establishment } from '../establishment';
import { Auth } from '../../auth/auth';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { NavbarAuth } from '../../shared/navbar-auth/navbar-auth';
import { Footer } from '../../shared/footer/footer';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';


@Component({
  selector: 'app-config',
  imports: [ButtonModule, ConfirmDialog, ToastModule,NavbarAuth,Footer, RouterLink, RouterLinkActive],
  templateUrl: './config.html',
  providers: [MessageService, ConfirmationService]
})
export class Config implements OnInit{
  public user: any = {}
  messageService = inject(MessageService);
  constructor(private establishment: Establishment, private userService: Auth, private confirmationService: ConfirmationService, private router: Router) { }

  ngOnInit(): void {
    const {user, token } = this.userService.getUserData()
    this.user = user
    console.log(this.user)
  }

  delete(event: Event) {
    this.confirmationService.confirm({
      message: 'Você quer excluir sua empresa?',
      header: 'Confirmar',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Confirmar',
      },
      accept: () => {
        this.establishment.delete(this.user?._id).subscribe({
          next: (data: any) => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Você excluiu sua empresa!' });
            setTimeout(() => {
              this.router.navigate(['/'])
            }, 2000)
          },
          error: (data: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro ao excluir a empresa',
              detail: data?.error?.message
            });
          }
        })
      },
      reject: () => {},
    });

  }
}
