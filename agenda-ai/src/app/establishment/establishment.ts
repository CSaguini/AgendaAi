import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Auth } from '../auth/auth';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import type { IEntrepreneur } from '../auth/types/entrepreneur.type';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Establishment {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private user = inject(Auth);

  register(data: IEntrepreneur) {
    const userData = this.user.getUserData();
    const userId = userData?.user?._id

    if (!userId) {
      console.error("Usuário não encontrado!");
      return throwError(() => new Error("Usuário não encontrado"));
    }

    localStorage.clear()
    this.user.getUserById(userId)

    return this.http.post<IEntrepreneur>(
      `http://localhost:3000/entrepreneur/register/${userId}`,
      data
    ).pipe(
      catchError(err => {
        console.error(err);
        return throwError(() => err);
      })
    );
  }

  delete(id: string) {
    return this.http.delete(
      `http://localhost:3000/entrepreneur/delete/${id}`
    ).pipe(
      catchError(err => {
        console.error(err);
        return throwError(() => err);
      })
    );
  }
}
