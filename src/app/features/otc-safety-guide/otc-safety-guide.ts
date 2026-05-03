import { environment } from '../../../../environments/environment';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../core/services/translation.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-otc-safety-guide',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './otc-safety-guide.html'
})
export class OtcSafetyGuide {
  translation = inject(TranslationService);
  http = inject(HttpClient);

  drugName = '';
  guide: any = null;
  loading = false;
  error: string | null = null;
  rules = this.translation.getLocalizedContent('otcGuide.rules');

  async fetchGuide() {
    if (!this.drugName.trim()) return;
    
    this.loading = true;
    this.error = null;
    this.guide = null;
    
    try {
        const res = await firstValueFrom(this.http.post<any>(`${environment.apiUrl}/chat`, { 
            prompt: `Provide OTC Safety Guide for ${this.drugName}. Language: ${this.translation.language}. Return JSON with: indications, warnings, safeDose, maxDose, contraindications, sideEffects, interactions.`, 
            language: this.translation.language 
        }));
        
        try {
           const jsonMatch = res?.text?.match(/\{[\s\S]*\}/);
           this.guide = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
        } catch(e) {
           this.guide = {
               indications: "Unable to parse.",
               warnings: res?.text || "Unknown error."
           };
        }
    } catch (err: any) {
        this.error = err.message || this.translation.t('common.error');
    } finally {
        this.loading = false;
    }
  }
}

