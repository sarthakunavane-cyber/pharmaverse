import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../core/services/translation.service';
import { GeminiService } from '../../core/services/gemini.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-pharmacist-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pharmacist-chatbot.html'
})
export class PharmacistChatbot implements OnInit {
  translation = inject(TranslationService);
  http = inject(HttpClient);
  
  messages: { id: string, text: string, sender: 'user' | 'bot' }[] = [];
  input = '';
  loading = false;
  isRecording = false;
  transcribing = false;

  mediaRecorder: any = null;
  audioChunks: Blob[] = [];

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  ngOnInit() {
    this.messages.push({
      id: 'welcome',
      text: this.translation.t('pharmacistChatbot.welcomeMessage'),
      sender: 'bot'
    });
  }

  scrollToBottom() {
    try {
      setTimeout(() => {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }, 100);
    } catch(err) { }
  }

  async handleSend() {
    if (!this.input.trim()) return;

    const userMessage = { id: Date.now().toString(), text: this.input, sender: 'user' as const };
    this.messages.push(userMessage);
    const userPrompt = this.input;
    this.input = '';
    this.loading = true;
    this.scrollToBottom();

    try {
      // Direct call to express backend
      const res = await firstValueFrom(this.http.post<{text: string}>('http://localhost:3000/api/chat', { prompt: userPrompt, language: this.translation.language }));
      if (res?.text) {
        this.messages.push({ id: 'bot-' + Date.now(), text: res.text, sender: 'bot' });
      }
    } catch (error) {
      this.messages.push({ id: 'error-' + Date.now(), text: this.translation.t('common.error'), sender: 'bot' });
    } finally {
      this.loading = false;
      this.scrollToBottom();
    }
  }

  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event: any) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.transcribing = true;
        try {
          // This will be properly integrated when the api handles audio transcription.
          // For now we simulate an empty text placeholder in the text bar.
          this.input = "Transcribed Audio [Simulated Placeholder]";
        } catch (err) {
          alert(this.translation.t('pharmacistChatbot.transcriptionError'));
        } finally {
          this.transcribing = false;
        }
      };
      
      this.mediaRecorder.start();
      this.isRecording = true;
    } catch (error) {
      alert(this.translation.t('pharmacistChatbot.micError'));
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }
}

