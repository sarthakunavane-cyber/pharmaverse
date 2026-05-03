import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../core/services/translation.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-medication-guide-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medication-guide-generator.html'
})
export class MedicationGuideGenerator {
  translation = inject(TranslationService);
  http = inject(HttpClient);

  drugName = '';
  guide: any = null;
  loading = false;
  error: string | null = null;

  async generateGuide() {
    if (!this.drugName.trim()) return;
    
    this.loading = true;
    this.error = null;
    this.guide = null;
    
    try {
        const res = await firstValueFrom(this.http.post<any>('http://localhost:3000/api/chat', { 
            prompt: `Generate a simplified Patient Medication Guide for ${this.drugName}. Language: ${this.translation.language}. Return JSON with: title, overview, directions, missedDose, interactions, sideEffects, storage.`, 
            language: this.translation.language 
        }));
        
        try {
           const jsonMatch = res?.text?.match(/\{[\s\S]*\}/);
           this.guide = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
        } catch(e) {
           this.guide = {
               overview: "Unable to parse the language model output.",
               sideEffects: res?.text || "Unknown error."
           };
        }
    } catch (err: any) {
        this.error = err.message || this.translation.t('common.error');
    } finally {
        this.loading = false;
    }
  }

  printGuide() {
    window.print();
  }
}

