import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-secao',
    standalone: true,
  imports: [CommonModule, CardModule, RouterLink, RouterLinkActive],
  templateUrl: './secao.html',
})
export class Secao {

}
