import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../core/services/translation.service';
import { GeminiService } from '../../core/services/gemini.service';
import { SymptomAnalysisResult } from '../../core/models/models';

@Component({
  selector: 'app-symptom-checker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './symptom-checker.html'
})
export class SymptomChecker {
  translation = inject(TranslationService);
  gemini = inject(GeminiService);

  input = '';
  result: SymptomAnalysisResult | null = null;
  loading = false;
  error: string | null = null;

  async analyze() {
    if (!this.input.trim()) return;
    this.loading = true;
    this.error = null;
    this.result = null;

    try {
      this.result = await this.gemini.analyzeSymptoms(this.input, this.translation.language);
    } catch (e: any) {
      this.error = e.message || this.translation.t('common.error');
    } finally {
      this.loading = false;
    }
  }

  getConfidenceColor(confidence: string | undefined) {
    if (!confidence) return 'text-gray-500 glass-panel';
    const l = confidence.toLowerCase();
    if (l.includes('high') || l.includes('उच्च')) return 'text-green-700 glass-panel dark:text-green-300 ';
    if (l.includes('medium') || l.includes('मध्यम')) return 'text-yellow-700 glass-panel dark:text-yellow-300 ';
    return 'text-orange-700 glass-panel dark:text-orange-300 ';
  }
}

