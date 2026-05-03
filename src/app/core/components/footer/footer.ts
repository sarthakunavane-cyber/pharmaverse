import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="glass-panel  shadow-inner mt-mt-auto transition-colors duration-300">
      <div class="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 ">
          <div class="mb-4 md:mb-0 text-center md:text-left flex-1 max-w-2xl">
            <p>{{ translation.t('footer.disclaimer') }}</p>
          </div>
          <div class="flex items-center space-x-4">
             <div class="flex space-x-4 mb-4 md:mb-0">
               <!-- Social Icons Placeholder -->
             </div>
             <p>{{ getCopyright() }}</p>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class Footer {
  translation = inject(TranslationService);
  
  getCopyright(): string {
    const text = this.translation.t('footer.copyright');
    return text.replace('{year}', new Date().getFullYear().toString());
  }
}


