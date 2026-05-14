import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-text-to-speech',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './text-to-speech.html'
})
export class TextToSpeech {
  translation = inject(TranslationService);
  
  textToSpeak = '';
  isSpeaking = false;
  selectedVoice: SpeechSynthesisVoice | null = null;
  voices: SpeechSynthesisVoice[] = [];
  ttsLanguage = 'all';
  
  ngOnInit() {
      this.populateVoiceList();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.onvoiceschanged = () => this.populateVoiceList();
      }
  }

  populateVoiceList() {
      if (typeof window === 'undefined') return;
      const allVoices = window.speechSynthesis.getVoices();
      
      this.voices = allVoices.filter(v => {
          if (this.ttsLanguage === 'all') return true;
          return v.lang.toLowerCase().startsWith(this.ttsLanguage.toLowerCase());
      });
      
      if (this.voices.length > 0 && (!this.selectedVoice || !this.voices.includes(this.selectedVoice))) {
          this.selectedVoice = this.voices[0];
      }
  }

  onLanguageFilterChange() {
      this.populateVoiceList();
  }

  handleSpeak() {
      if (!this.textToSpeak.trim() || typeof window === 'undefined') return;
      
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(this.textToSpeak);
      if (this.selectedVoice) utterance.voice = this.selectedVoice;
      
      utterance.onstart = () => this.isSpeaking = true;
      utterance.onend = () => this.isSpeaking = false;
      utterance.onerror = () => this.isSpeaking = false;
      
      window.speechSynthesis.speak(utterance);
  }

  handleStop() {
      if (typeof window !== 'undefined') {
          window.speechSynthesis.cancel();
          this.isSpeaking = false;
      }
  }
}

