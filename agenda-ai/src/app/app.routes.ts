import { Routes } from '@angular/router';
import { HomeUser } from './home/home-user/home-user';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { ForgotPassword } from './auth/forgot-password/forgot-password';
import { Profile } from './user/profile/profile';
import { Establishments } from './user/establishments/establishments';
import { Contact } from './contact/contact';
import { Team } from './team/team';
import { About } from './about/about';
import { Profile as ProfileEstablishment } from './establishment/profile/profile'
import { Register as RegisterEstablishment } from './establishment/register/register'
import {Scheduling as SchedulingEstablishment} from './establishment/scheduling/scheduling'
import { Complaints } from './admin/complaints/complaints';
import { CarouselEditor } from './admin/carousel-editor/carousel-editor';
import { Companies } from './admin/companies/companies';
import { Users } from './admin/users/users';
import { Equipe } from './equipe/equipe';
import { Config } from './establishment/config/config';
import { NewPassword } from './auth/new-password/new-password';
import { PreScheduling } from './establishment/pre-scheduling/pre-scheduling';
import { Termos } from './establishment/termos/termos';
import { Politicas } from './establishment/politicas/politicas';
import { NavbarAdm } from './admin/navbar-adm/navbar-adm';
import { Secao } from './home/secao/secao';
import { DuvidaAgen } from './home/duvida-agen/duvida-agen';
import { DuvidaEmpre } from './home/duvida-empre/duvida-empre';
import { Chatbot } from './chatbot/chatbot';


export const routes: Routes = [
  // Home
  { path: '', component: HomeUser },
  { path: 'home/secao', component: Secao },
  { path: 'home/duvida-agen', component: DuvidaAgen },  
  { path: 'home/duvida-empre', component: DuvidaEmpre  },
  
  // Chatbot
  { path: 'chatbot', component: Chatbot },
  
  // Auth
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'new-password/:id/:token', component: NewPassword },

  // User
  { path: 'user/profile', component: Profile },
  { path: 'user/establishments', component: Establishments },
  { path: 'contact', component: Contact },
  { path: 'team', component: Team },
  { path: 'about', component: About },

  // Establishment
  { path: 'establishment/profile', component: ProfileEstablishment },
  { path: 'establishment/register', component: RegisterEstablishment },
  { path: 'establishment/scheduling', component: SchedulingEstablishment }, 
  { path: 'establishment/config', component: Config},
  { path: 'establishment/scheduling/:idService/:idUser', component: SchedulingEstablishment},
  {path: 'establishment/pre-scheduling/:id', component: PreScheduling},
  {path: 'establishment/termos', component: Termos},
  {path: 'establishment/politicas', component: Politicas},

  // Admin
  { path: 'admin/navbar-adm', component: NavbarAdm},
  { path: 'admin/complaints', component: Complaints },
  { path: 'admin/carousel', component: CarouselEditor },
  { path: 'admin/companies', component: Companies },
  { path: 'admin/users', component: Users },

  // fallback
  { path: '**', redirectTo: '', pathMatch: 'full' },

   {path: 'equipe', component: Equipe},

   { path: 'editar-servico/:id', component: ProfileEstablishment },
];

