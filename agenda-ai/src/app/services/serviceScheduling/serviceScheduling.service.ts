import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceSchedulingService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/scheduling';

  getAvailableTimes(serviceId: string, date: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/available-times/${serviceId}?date=${date}`);
  }

  createScheduling(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, payload);
  }
}
