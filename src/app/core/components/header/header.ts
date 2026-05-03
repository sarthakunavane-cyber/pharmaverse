import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslationService } from '../../services/translation.service';
import { ThemeService } from '../../services/theme.service';
import { NAV_LINKS } from '../../constants/constants';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html'
})
export class Header {
  translation = inject(TranslationService);
  theme = inject(ThemeService);
  router = inject(Router);

  navLinks = NAV_LINKS;

  get isHome(): boolean {
    return this.router.url === '/home' || this.router.url === '/';
  }

  handleGoHome() {
    this.router.navigate(['/home']);
  }

  onLanguageChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.translation.setLanguage(target.value as 'en' | 'hi' | 'mr');
  }

  toggleTheme() {
    this.theme.toggle();
  }
}

