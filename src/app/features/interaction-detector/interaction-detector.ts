import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../core/services/translation.service';
import { GeminiService } from '../../core/services/gemini.service';
import { InteractionResult, Severity } from '../../core/models/models';
import { ResultCardComponent } from '../../shared/result-card/result-card';

type InteractionType = 'drugHerb' | 'drugDrug' | 'drugSupplement' | 'drugFood' | 'polypharmacy';

@Component({
  selector: 'app-interaction-detector',
  standalone: true,
  imports: [CommonModule, FormsModule, ResultCardComponent],
  templateUrl: './interaction-detector.html'
})
export class InteractionDetector implements OnInit {
  translation = inject(TranslationService);
  gemini = inject(GeminiService);

  interactionType: InteractionType = 'drugHerb';
  
  input1 = '';
  input2 = '';
  polypharmacy = '';
  
  result: any = null; // InteractionResult | InteractionResult[]
  loading = false;
  error: string | null = null;
  
  tabs: { type: InteractionType; labelKey: string }[] = [
    { type: 'drugHerb', labelKey: 'drugHerb' },
    { type: 'drugDrug', labelKey: 'drugDrug' },
    { type: 'drugSupplement', labelKey: 'drugSupplement' },
    { type: 'drugFood', labelKey: 'drugFood' },
    { type: 'polypharmacy', labelKey: 'polypharmacy' },
  ];

  labels = {
    drugHerb: { l1: 'drugLabel', p1: 'drugPlaceholder', l2: 'herbLabel', p2: 'herbPlaceholder'},
    drugDrug: { l1: 'drug1Label', p1: 'drug1Placeholder', l2: 'drug2Label', p2: 'drug2Placeholder'},
    drugSupplement: { l1: 'drugLabel', p1: 'drugPlaceholder', l2: 'supplementLabel', p2: 'supplementPlaceholder'},
    drugFood: { l1: 'drugLabel', p1: 'drugPlaceholder', l2: 'foodLabel', p2: 'foodPlaceholder'},
  };

  ngOnInit() {}

  get currentLabels() {
    if (this.interactionType === 'polypharmacy') return null;
    return this.labels[this.interactionType as keyof typeof this.labels];
  }

  get examples() {
    return this.translation.getLocalizedContent(`interactionChecker.examples.${this.interactionType}`);
  }

  handleModeChange(mode: InteractionType) {
    if (this.loading) return;
    this.interactionType = mode;
    this.input1 = '';
    this.input2 = '';
    this.polypharmacy = '';
    this.result = null;
    this.error = null;
  }

  handleExampleClick(example: {input1: string; input2: string}) {
    this.input1 = example.input1;
    this.input2 = example.input2;
    this.polypharmacy = '';
    this.handleFormSubmit();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  handlePolypharmacyExampleClick(example: { drugs: string; }) {
    this.input1 = '';
    this.input2 = '';
    this.polypharmacy = example.drugs;
    this.handleFormSubmit();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  validateInput(): string | null {
    if (this.interactionType === 'polypharmacy') {
        const drugs = this.polypharmacy.split(/[,;\n]/).map(d => d.trim()).filter(Boolean);
        if (drugs.length < 2) return this.translation.t('interactionChecker.validation.polypharmacyEmpty');
    } else {
        const i1 = this.input1.trim();
        const i2 = this.input2.trim();
        if (!i1 && !i2) return this.translation.t('interactionChecker.validation.bothEmpty');
        if (!i1) return this.translation.t('interactionChecker.validation.item1Empty');
        if (!i2) return this.translation.t('interactionChecker.validation.item2Empty');
        if (i1.length < 3 || i2.length < 3) return this.translation.t('interactionChecker.validation.tooShort');
    }
    return null;
  }

  calculateInteractionScore(res: InteractionResult): number {
    let score = 0;
    
    // Severity mapping
    switch (res.severity) {
        case Severity.Major: score += 40; break;
        case Severity.Moderate: score += 20; break;
        case Severity.Minor: score += 5; break;
    }
    
    // Evidence Level mapping
    const evidence = res.evidenceLevel?.toLowerCase() || '';
    if (evidence.includes('level a') || evidence.includes('strong') || evidence.includes('high')) score += 20;
    else if (evidence.includes('level b') || evidence.includes('moderate')) score += 10;
    else if (evidence.includes('level c') || evidence.includes('weak') || evidence.includes('limited')) score += 5;

    // Risk Factor mapping
    const riskFactorScores: Record<string, number> = {
        'QT_PROLONGATION': 15,
        'BLEEDING_RISK': 15,
        'SEROTONIN_SYNDROME': 20,
        'CNS_DEPRESSION': 15,
        'HYPOTENSION': 10,
        'HYPERKALEMIA': 10,
        'NEPHROTOXICITY': 15,
        'HEPATOTOXICITY': 15
    };

    res.riskFactors?.forEach(factor => {
        score += riskFactorScores[factor.toUpperCase()] || 5;
    });

    return Math.min(score, 100);
  }

  async handleFormSubmit() {
    const tempError = this.validateInput();
    if (tempError) {
      this.error = tempError;
      return;
    }
    
    this.loading = true;
    this.error = null;
    this.result = null;

    try {
      let tempResult;
      const lang = this.translation.language;
      switch (this.interactionType) {
        case 'drugHerb':
          tempResult = await this.gemini.fetchDrugHerbInteraction(this.input1, this.input2, lang);
          break;
        case 'drugDrug':
          tempResult = await this.gemini.fetchDrugDrugInteraction(this.input1, this.input2, lang);
          break;
        case 'drugSupplement':
          tempResult = await this.gemini.fetchDrugSupplementInteraction(this.input1, this.input2, lang);
          break;
        case 'drugFood':
          tempResult = await this.gemini.fetchDrugFoodInteraction(this.input1, this.input2, lang);
          break;
        case 'polypharmacy':
          const drugs = this.polypharmacy.split(/[,;\n]/).map(d => d.trim()).filter(Boolean);
          tempResult = await this.gemini.fetchPolypharmacyInteraction(drugs, lang);
          break;
      }

      if (Array.isArray(tempResult)) {
        this.result = tempResult.map(res => ({ ...res, interactionScore: this.calculateInteractionScore(res) }));
      } else {
        this.result = { ...tempResult, interactionScore: this.calculateInteractionScore(tempResult as InteractionResult) };
      }
    } catch (e: any) {
        this.error = e.message || this.translation.t('common.error');
    } finally {
        this.loading = false;
    }
  }

  get isArrayResult() {
    return Array.isArray(this.result);
  }
}

