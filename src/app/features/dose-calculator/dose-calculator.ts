import { environment } from '../../../environments/environment';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../core/services/translation.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-dose-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dose-calculator.html'
})
export class DoseCalculator {
  translation = inject(TranslationService);
  http = inject(HttpClient);

  details = {
      drug: '',
      age: '',
      weight: '',
      gender: 'Male',
      indication: '',
      renalStatus: 'Normal',
      hepaticStatus: 'Normal',
  };
  
  result: any = null;
  loading = false;
  error: string | null = null;

  async handleSubmit() {
    this.loading = true;
    this.error = null;
    this.result = null;
    try {
        const res = await firstValueFrom(this.http.post<any>(`${environment.apiUrl}/chat`, { 
            prompt: `Calculate safe dosage for drug: ${this.details.drug}, Age: ${this.details.age}, Weight: ${this.details.weight}kg, Gender: ${this.details.gender}, Indication: ${this.details.indication}, Renal: ${this.details.renalStatus}, Hepatic: ${this.details.hepaticStatus}. Return JSON with: recommendedDose, maxSafeDose, adjustmentNotes.`, 
            language: this.translation.language 
        }));
        
        // Very brittle string parsing simulator for the chat endpoint
        try {
           const jsonMatch = res?.text?.match(/\{[\s\S]*\}/);
           this.result = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
        } catch(e) {
           this.result = {
               recommendedDose: "Check with pharmacist",
               maxSafeDose: "Unknown",
               adjustmentNotes: res?.text || "Could not parse"
           };
        }
    } catch (err: any) {
        this.error = err.message || this.translation.t('common.error');
    } finally {
        this.loading = false;
    }
  }
}

