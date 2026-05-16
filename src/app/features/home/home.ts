import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../../core/services/translation.service';
import { GsapTiltDirective } from '../../shared/directives/gsap-tilt.directive';
import { GsapRevealDirective } from '../../shared/directives/gsap-reveal.directive';
import { Feedback } from '../feedback/feedback';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, GsapTiltDirective, GsapRevealDirective, Feedback],
  templateUrl: './home.html'
})
export class Home implements OnInit, OnDestroy {
  translation = inject(TranslationService);
  
  tools = [
      { id: 'interaction-detector', icon: 'zap', titleKey: 'pages.InteractionDetector', descKey: 'home.tools.InteractionDetector.description', color: 'glass-panel text-green-600  dark:text-green-400' },
      { id: 'prescription-reader', icon: 'file-text', titleKey: 'pages.PrescriptionReader', descKey: 'home.tools.PrescriptionReader.description', color: 'glass-panel text-blue-600  dark:text-blue-400' },
      { id: 'symptom-checker', icon: 'activity', titleKey: 'pages.SymptomChecker', descKey: 'home.tools.SymptomChecker.description', color: 'glass-panel text-red-600  dark:text-red-400' },
      { id: 'pill-identifier', icon: 'camera', titleKey: 'pages.PillIdentifier', descKey: 'home.tools.PillIdentifier.description', color: 'glass-panel text-purple-600  dark:text-purple-400' },
      { id: 'dose-calculator', icon: 'calculator', titleKey: 'pages.DoseCalculator', descKey: 'home.tools.DoseCalculator.description', color: 'glass-panel text-orange-600  dark:text-orange-400' },
      { id: 'pharmacist-chatbot', icon: 'message-circle', titleKey: 'pages.PharmacistChatbot', descKey: 'home.tools.PharmacistChatbot.description', color: 'glass-panel text-teal-600  dark:text-teal-400' },
      { id: 'live-pharmacist', icon: 'mic', titleKey: 'pages.LivePharmacist', descKey: 'home.tools.LivePharmacist.description', color: 'glass-panel text-pink-600  dark:text-pink-400' },
      { id: 'text-to-speech', icon: 'volume-2', titleKey: 'pages.TextToSpeech', descKey: 'home.tools.TextToSpeech.description', color: 'glass-panel text-indigo-600  dark:text-indigo-400' },
      { id: 'clinical-trial-finder', icon: 'search', titleKey: 'pages.ClinicalTrialFinder', descKey: 'home.tools.ClinicalTrialFinder.description', color: 'glass-panel text-cyan-600  dark:text-cyan-400' },
      { id: 'otc-safety-guide', icon: 'shield', titleKey: 'pages.OtcSafetyGuide', descKey: 'home.tools.OtcSafetyGuide.description', color: 'glass-panel text-yellow-600  dark:text-yellow-400' },
      { id: 'medication-guide-generator', icon: 'book-open', titleKey: 'pages.MedicationGuideGenerator', descKey: 'home.tools.MedicationGuideGenerator.description', color: 'glass-panel text-rose-600  dark:text-rose-400' }
  ];

  ngOnInit() {}
  ngOnDestroy() {}
}

