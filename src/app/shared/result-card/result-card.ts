import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../core/services/translation.service';
import { InteractionResult, InteractionCategory, Severity } from '../../core/models/models';

@Component({
  selector: 'app-result-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result-card.html'
})
export class ResultCardComponent {
  translation = inject(TranslationService);
  
  @Input() result!: InteractionResult;

  Severity = Severity;

  getCategoryStyle(category: InteractionCategory) {
    switch (category) {
      case InteractionCategory.Safe:
        return {
          bgColor: 'glass-panel ', borderColor: 'border-green-500', textColor: 'text-green-800 dark:text-green-300',
          title: this.translation.t('resultCard.category.Safe'),
        };
      case InteractionCategory.Caution:
        return {
          bgColor: 'glass-panel ', borderColor: 'border-yellow-500', textColor: 'text-yellow-800 dark:text-yellow-300',
          title: this.translation.t('resultCard.category.Caution'),
        };
      case InteractionCategory.Avoid:
        return {
          bgColor: 'glass-panel ', borderColor: 'border-red-500', textColor: 'text-red-800 dark:text-red-300',
          title: this.translation.t('resultCard.category.Avoid'),
        };
      default:
        return {
          bgColor: 'glass-panel ', borderColor: 'border-gray-500', textColor: 'text-white ',
          title: 'Information',
        };
    }
  }

  getScoreColor(s: number) {
    if (s >= 70) return 'bg-red-500';
    if (s >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  }
}

