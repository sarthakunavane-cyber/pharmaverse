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
  
  ngOnInit() {
      this.populateVoiceList();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.onvoiceschanged = () => this.populateVoiceList();
      }
  }

  populateVoiceList() {
      if (typeof window === 'undefined') return;
      this.voices = window.speechSynthesis.getVoices().filter(v => 
          v.lang.startsWith(this.translation.language) || v.lang.startsWith('en')
      );
      if (this.voices.length > 0 && !this.selectedVoice) {
          this.selectedVoice = this.voices[0];
      }
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

