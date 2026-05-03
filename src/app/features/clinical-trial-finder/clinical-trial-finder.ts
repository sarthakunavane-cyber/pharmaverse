import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../core/services/translation.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-clinical-trial-finder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clinical-trial-finder.html'
})
export class ClinicalTrialFinder {
  translation = inject(TranslationService);
  http = inject(HttpClient);

  searchQuery = '';
  trials: any[] | null = null;
  loading = false;
  error: string | null = null;

  statusFilter = 'all';
  phaseFilter = 'all';

  async handleSearch() {
    if (!this.searchQuery.trim()) return;
    this.loading = true;
    this.error = null;
    this.trials = null;

    try {
        const res = await firstValueFrom(this.http.post<any>('http://localhost:3000/api/chat', { 
            prompt: `Find 3 real clinical trials in India for: ${this.searchQuery}. Language: ${this.translation.language}. Return JSON array of objects with: title, phase, status, location, sponsor, summary.`, 
            language: this.translation.language 
        }));
        
        try {
           const jsonMatch = res?.text?.match(/\[[\s\S]*\]/);
           this.trials = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
        } catch(e) {
           this.trials = [];
        }
    } catch (err: any) {
        this.error = err.message || this.translation.t('common.error');
    } finally {
        this.loading = false;
    }
  }

  get filteredTrials() {
      if (!this.trials) return null;
      return this.trials.filter(t => {
          if (this.statusFilter !== 'all' && t.status !== this.statusFilter) return false;
          if (this.phaseFilter !== 'all' && t.phase !== this.phaseFilter) return false;
          return true;
      });
  }
}

