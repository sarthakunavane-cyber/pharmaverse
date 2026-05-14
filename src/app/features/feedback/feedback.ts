import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-2xl mx-auto p-8 glass-panel rounded-2xl shadow-xl">
        <h2 class="text-3xl font-bold mb-2 text-gray-100">Give Feedback</h2>
        <p class="text-gray-300 mb-8">We would love to hear your thoughts on PharmaVerse to help us improve.</p>
        
        <form *ngIf="!submitted" (ngSubmit)="submit()" class="space-y-6">
            <div>
                 <label class="block text-sm font-medium text-gray-200 mb-2">How would you rate your experience?</label>
                 <div class="flex gap-2" (mouseleave)="hoverRating = 0">
                     <button *ngFor="let star of [1, 2, 3, 4, 5]" 
                             type="button" 
                             (click)="rating = star" 
                             (mouseenter)="hoverRating = star"
                             class="transition-all transform hover:scale-110 focus:outline-none focus:ring-0">
                         <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" 
                              [attr.fill]="(hoverRating >= star || (!hoverRating && rating >= star)) ? 'currentColor' : 'none'" 
                              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                              class="text-yellow-400">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                         </svg>
                     </button>
                 </div>
            </div>
            
            <div>
                 <label class="block text-sm font-medium text-gray-200 mb-2">What feature do you use the most?</label>
                 <select [(ngModel)]="feature" name="feature" class="w-full p-3 border border-medical-cyan/30 rounded-lg bg-transparent text-white focus:ring-2 focus:ring-medical-cyan/50 outline-none">
                     <option value="Prescription Reader" class="bg-slate-900">Prescription Reader</option>
                     <option value="Interaction Checker" class="bg-slate-900">Interaction Checker</option>
                     <option value="Pharmacist Chatbot" class="bg-slate-900">Pharmacist Chatbot</option>
                     <option value="Dose Calculator" class="bg-slate-900">Dose Calculator</option>
                     <option value="Other" class="bg-slate-900">Other</option>
                 </select>
            </div>

            <div>
                 <label class="block text-sm font-medium text-gray-200 mb-2">Additional Comments</label>
                 <textarea [(ngModel)]="comments" name="comments" rows="4" class="w-full p-3 border border-medical-cyan/30 rounded-lg bg-transparent text-white focus:ring-2 focus:ring-medical-cyan/50 outline-none" placeholder="Tell us how we can improve..."></textarea>
            </div>

            <button type="submit" 
                    [disabled]="isSubmitting || !rating"
                    class="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition shadow-md">
                {{ isSubmitting ? 'Sending...' : (rating ? 'Submit Feedback' : 'Please select a rating') }}
            </button>
        </form>
        
        <div *ngIf="submitted" class="text-center py-10 animate-fade-in">
             <div class="text-5xl mb-4"></div>
             <h3 class="text-2xl font-bold text-gray-100 mb-2">Thank you!</h3>
             <p class="text-gray-300">Your feedback helps us make PharmaVerse better for everyone.</p>
             <button (click)="submitted = false; resetForm()" class="mt-6 text-medical-cyan hover:underline">Send another response</button>
        </div>
    </div>
  `
})
export class Feedback {
    private http = inject(HttpClient);
    
    submitted = false;
    isSubmitting = false;
    
    rating = 0;
    hoverRating = 0;
    feature = 'Prescription Reader';
    comments = '';

    submit() {
        if (!this.rating) return;
        
        this.isSubmitting = true;
        const payload = {
            rating: this.rating.toString(),
            feature: this.feature,
            comments: this.comments
        };

        this.http.post(`${environment.apiUrl}/feedback`, payload).subscribe({
            next: () => {
                this.submitted = true;
                this.isSubmitting = false;
                this.resetForm();
            },
            error: (err) => {
                console.error('Failed to send feedback', err);
                this.isSubmitting = false;
                alert('Sorry, we couldn\'t send your feedback right now. Please try again later.');
            }
        });
    }

    resetForm() {
        this.rating = 0;
        this.hoverRating = 0;
        this.feature = 'Prescription Reader';
        this.comments = '';
    }
}



