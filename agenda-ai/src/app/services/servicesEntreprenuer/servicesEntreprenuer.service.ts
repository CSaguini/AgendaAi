import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { IServicesEntreprenuer } from '../../auth/types/services_entreprenuer.type';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})

export class ServicesEntreprenuerService {
  private http = inject(HttpClient);

register(id: string, servicesEntreprenuer: IServicesEntreprenuer): Observable<IServicesEntreprenuer> {
  return this.http.post<IServicesEntreprenuer>(
    `http://localhost:3000/servicesEntreprenuer/register/${id}`,
    servicesEntreprenuer
  );
}

getServiceById(id: string) {
  return this.http.get(`http://localhost:3000/servicesEntreprenuer/get/${id}`);
}

updateService(id: string, dados: any) {
  return this.http.put(`http://localhost:3000/servicesEntreprenuer/update/${id}`, dados);
}
  
deleteService(id: string) {
  return this.http.delete(`http://localhost:3000/servicesEntreprenuer/delete/${id}`);
}

}