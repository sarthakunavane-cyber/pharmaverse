import { environment } from '../../../environments/environment';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { InteractionResult, PrescriptionAnalysisResult, SymptomAnalysisResult, DrugDetails } from '../models/models';

@Injectable({ providedIn: 'root' })
export class GeminiService {
  http = inject(HttpClient);
  baseUrl = environment.apiUrl;

  async fetchDrugHerbInteraction(drugName: string, herbName: string, language: string): Promise<InteractionResult> {
    const res = await firstValueFrom(this.http.post<InteractionResult>(`${this.baseUrl}/interactions/herb`, { drugName, herbName, language }));
    return res as InteractionResult;
  }

  async fetchDrugDrugInteraction(drug1: string, drug2: string, language: string): Promise<InteractionResult> {
    const res = await firstValueFrom(this.http.post<InteractionResult>(`${this.baseUrl}/interactions/drug`, { drug1, drug2, language }));
    return res as InteractionResult;
  }

  // Placeholder for others to preserve structure
  async fetchDrugSupplementInteraction(drug: string, supplement: string, language: string): Promise<InteractionResult> {
    const res = await firstValueFrom(this.http.post<InteractionResult>(`${this.baseUrl}/interactions/supplement`, { drug, supplement, language }));
    return res as InteractionResult;
  }
  
  async fetchDrugFoodInteraction(drug: string, food: string, language: string): Promise<InteractionResult> {
    const res = await firstValueFrom(this.http.post<InteractionResult>(`${this.baseUrl}/interactions/food`, { drug, food, language }));
    return res as InteractionResult;
  }

  async fetchPolypharmacyInteraction(drugs: string[], language: string): Promise<InteractionResult[]> {
    const res = await firstValueFrom(this.http.post<InteractionResult[]>(`${this.baseUrl}/interactions/polypharmacy`, { drugs, language }));
    return res as InteractionResult[];
  }

  async extractPrescriptionDetails(imageData: string, mimeType: string, language: string): Promise<PrescriptionAnalysisResult> {
    const res = await firstValueFrom(this.http.post<PrescriptionAnalysisResult>(`${this.baseUrl}/prescription/extract`, { imageData, mimeType, language }));
    return res as PrescriptionAnalysisResult;
  }

  async analyzeSymptoms(symptoms: string, language: string): Promise<SymptomAnalysisResult> {
    const res = await firstValueFrom(this.http.post<SymptomAnalysisResult>(`${this.baseUrl}/symptoms/analyze`, { symptoms, language }));
    return res as SymptomAnalysisResult;
  }

  async fetchDrugDetails(drugName: string, language: string): Promise<DrugDetails> {
    const res = await firstValueFrom(this.http.post<DrugDetails>(`${this.baseUrl}/drug/details`, { drugName, language }));
    return res as DrugDetails;
  }
}

