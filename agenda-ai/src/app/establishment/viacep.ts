import   { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import  { Observable } from 'rxjs';


export interface Endereco {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean; // <-- importante
}


@Injectable({
  providedIn: 'root'
})
export class ViacepService {
  private baseUrl = 'https://viacep.com.br/ws';

  constructor(private http: HttpClient) { }

  buscarCEP(cep: string): Observable<Endereco> {
  const onlyNumbers = cep.replace(/\D/g, ''); // mantém só números
  return this.http.get<Endereco>(`${this.baseUrl}/${onlyNumbers}/json/`);
}

}
