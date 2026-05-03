import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-2xl mx-auto p-8 glass-panel  rounded-2xl shadow-xl">
        <h2 class="text-3xl font-bold mb-2 text-gray-100 ">Give Feedback</h2>
        <p class="text-gray-300  mb-8">We would love to hear your thoughts on PharmaVerse to help us improve.</p>
        
        <form *ngIf="!submitted" (ngSubmit)="submit()" class="space-y-6">
            <div>
                 <label class="block text-sm font-medium text-gray-200  mb-2">How would you rate your experience?</label>
                 <div class="flex gap-4">
                     <button type="button" class="text-3xl hover:scale-110 transition">😞</button>
                     <button type="button" class="text-3xl hover:scale-110 transition">😐</button>
                     <button type="button" class="text-3xl hover:scale-110 transition">🙂</button>
                     <button type="button" class="text-3xl hover:scale-110 transition">🤩</button>
                 </div>
            </div>
            
            <div>
                 <label class="block text-sm font-medium text-gray-200  mb-2">What feature do you use the most?</label>
                 <select class="w-full p-3 border border-medical-cyan/30 dark:border-medical-cyan/30 rounded-lg   text-white ">
                     <option>Prescription Reader</option>
                     <option>Interaction Checker</option>
                     <option>Pharmacist Chatbot</option>
                     <option>Dose Calculator</option>
                     <option>Other</option>
                 </select>
            </div>

            <div>
                 <label class="block text-sm font-medium text-gray-200  mb-2">Additional Comments</label>
                 <textarea rows="4" class="w-full p-3 border border-medical-cyan/30 dark:border-medical-cyan/30 rounded-lg   text-white " placeholder="Tell us how we can improve..."></textarea>
            </div>

            <button type="submit" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-md">
                Submit Feedback
            </button>
        </form>
        
        <div *ngIf="submitted" class="text-center py-10 animate-fade-in">
             <div class="text-5xl mb-4">🙌</div>
             <h3 class="text-2xl font-bold text-gray-100  mb-2">Thank you!</h3>
             <p class="text-gray-300 ">Your feedback helps us make PharmaVerse better for everyone.</p>
        </div>
    </div>
  `
})
export class Feedback {
    submitted = false;
    submit() {
        this.submitted = true;
    }
}



