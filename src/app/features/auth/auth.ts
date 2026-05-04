import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center p-6">
      <div class="max-w-md w-full glass-panel p-10 rounded-3xl shadow-2xl animate-fade-in border border-medical-cyan/20">
        <div class="text-center mb-10">
          <div class="w-16 h-16 bg-medical-cyan/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-medical-cyan/30">
             <span class="text-3xl">💊</span>
          </div>
          <h2 class="text-3xl font-bold text-white mb-2">{{ isLogin() ? 'Welcome Back' : 'Create Account' }}</h2>
          <p class="text-gray-400">{{ isLogin() ? 'Login to access your medical history' : 'Join PharmaVerse for personalized care' }}</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="space-y-6">
          <div *ngIf="!isLogin()">
            <label class="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <input type="text" [(ngModel)]="formData.name" name="name" required
                   class="w-full p-4 bg-slate-900/50 border border-gray-700 rounded-xl text-white focus:border-medical-cyan outline-none transition">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input type="email" [(ngModel)]="formData.email" name="email" required
                   class="w-full p-4 bg-slate-900/50 border border-gray-700 rounded-xl text-white focus:border-medical-cyan outline-none transition">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input type="password" [(ngModel)]="formData.password" name="password" required
                   class="w-full p-4 bg-slate-900/50 border border-gray-700 rounded-xl text-white focus:border-medical-cyan outline-none transition">
          </div>

          <button type="submit" [disabled]="loading()"
                  class="w-full py-4 bg-gradient-to-r from-blue-600 to-medical-cyan hover:from-blue-700 hover:to-blue-500 text-white font-bold rounded-xl transition shadow-lg shadow-blue-900/20 disabled:opacity-50">
            {{ loading() ? 'Processing...' : (isLogin() ? 'Login' : 'Sign Up') }}
          </button>
        </form>

        <div class="mt-8 text-center">
          <p class="text-gray-400">
            {{ isLogin() ? "Don't have an account?" : "Already have an account?" }}
            <button (click)="toggleMode()" class="text-medical-cyan hover:underline ml-1 font-medium">
              {{ isLogin() ? 'Sign Up' : 'Login' }}
            </button>
          </p>
        </div>
      </div>
    </div>
  `
})
export class Auth {
  private auth = inject(AuthService);
  private router = inject(Router);

  isLogin = signal(true);
  loading = signal(false);
  formData = { email: '', password: '', name: '' };

  toggleMode() {
    this.isLogin.update(v => !v);
  }

  onSubmit() {
    this.loading.set(true);
    const action = this.isLogin() 
      ? this.auth.login({ email: this.formData.email, password: this.formData.password })
      : this.auth.register(this.formData);

    action.subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        alert(err.error?.error || 'Authentication failed');
        this.loading.set(false);
      }
    });
  }
}
