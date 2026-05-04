import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs';

export interface User {
  id: string;
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  currentUser = signal<User | null>(null);

  constructor() {
    const savedUser = localStorage.getItem('pharmaverse_user');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  getToken() {
    return localStorage.getItem('pharmaverse_token');
  }

  register(credentials: any) {
    return this.http.post<any>(`${environment.apiUrl}/auth/register`, credentials).pipe(
      tap(res => this.setSession(res))
    );
  }

  login(credentials: any) {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap(res => this.setSession(res))
    );
  }

  logout() {
    localStorage.removeItem('pharmaverse_token');
    localStorage.removeItem('pharmaverse_user');
    this.currentUser.set(null);
  }

  private setSession(res: any) {
    localStorage.setItem('pharmaverse_token', res.token);
    localStorage.setItem('pharmaverse_user', JSON.stringify(res.user));
    this.currentUser.set(res.user);
  }
}
