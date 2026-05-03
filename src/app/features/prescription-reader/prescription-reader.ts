import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../core/services/translation.service';
import { GeminiService } from '../../core/services/gemini.service';
import { ResultCardComponent } from '../../shared/result-card/result-card';
import { PrescriptionAnalysisResult, InteractionResult } from '../../core/models/models';

@Component({
  selector: 'app-prescription-reader',
  standalone: true,
  imports: [CommonModule, FormsModule, ResultCardComponent],
  templateUrl: './prescription-reader.html'
})
export class PrescriptionReader implements OnInit {
  translation = inject(TranslationService);
  gemini = inject(GeminiService);

  prescriptionData: PrescriptionAnalysisResult | null = null;
  interactions: InteractionResult[] | null = null;
  loading = false;
  interactionLoading = false;
  error: string | null = null;
  image: string | null = null;
  
  expandedDrugIndex: number | null = null;
  drugDetailsLoading = false;
  
  isDragActive = false;

  ngOnInit() {}

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      await this.processFile(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragActive = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragActive = false;
  }

  async onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragActive = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      await this.processFile(files[0]);
    }
  }

  private async processFile(file: File) {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Full = reader.result as string;
        const base64Data = base64Full.split(',')[1];
        const mimeType = file.type;
        await this.analyzeImage(base64Data, mimeType, base64Full);
      };
    } catch (e: any) {
      this.error = e.message || "Error processing file.";
    }
  }

  async analyzeImage(base64Image: string, mimeType: string, fullBase64: string) {
    this.loading = true;
    this.error = null;
    this.prescriptionData = null;
    this.interactions = null;
    this.expandedDrugIndex = null;
    this.image = fullBase64;

    try {
      this.prescriptionData = await this.gemini.extractPrescriptionDetails(base64Image, mimeType, this.translation.language);
      this.checkInteractions();
    } catch (err: any) {
      const errorMessage = err.message || this.translation.t('common.error');
      if (errorMessage.includes('SAFETY')) {
          this.error = this.translation.t('prescriptionReader.errors.safety');
      } else if (errorMessage.includes('unreadable')) {
          this.error = this.translation.t('prescriptionReader.errors.unreadable');
      } else {
          this.error = this.translation.t('common.error');
      }
    } finally {
      this.loading = false;
    }
  }

  async checkInteractions() {
    if (this.prescriptionData && this.prescriptionData.medications.length > 1) {
        this.interactionLoading = true;
        this.interactions = null;
        try {
            const drugNames = this.prescriptionData.medications.map(m => m.genericName || m.drugName).filter(Boolean);
            if (drugNames.length > 1) {
                this.interactions = await this.gemini.fetchPolypharmacyInteraction(drugNames, this.translation.language);
            }
        } catch (error) {
            console.error("Error checking interactions:", error);
        } finally {
            this.interactionLoading = false;
        }
    }
  }

  clearState() {
    this.image = null;
    this.prescriptionData = null;
    this.error = null;
    this.expandedDrugIndex = null;
    this.interactions = null;
  }
}

