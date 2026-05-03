import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private dark = new BehaviorSubject<boolean>(false);
  isDark$ = this.dark.asObservable();
  
  constructor() {
    // Check initial state
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        this.dark.next(true);
        document.documentElement.classList.add('dark');
    }
  }

  toggle() { 
      const isDark = !this.dark.value;
      this.dark.next(isDark);
      if (isDark) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('theme', 'dark');
      } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('theme', 'light');
      }
  }
}

