import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-6xl mx-auto p-8 glass-panel rounded-2xl shadow-xl mt-10">
        <div class="flex justify-between items-center mb-8">
            <div>
                <h2 class="text-4xl font-bold text-white mb-2">Review Dashboard</h2>
                <p class="text-gray-400">Manage and view all incoming user feedback.</p>
            </div>
            <button (click)="loadFeedback()" class="px-6 py-2 bg-medical-cyan/20 border border-medical-cyan/50 text-medical-cyan rounded-full hover:bg-medical-cyan/30 transition">
                Refresh Reviews
            </button>
        </div>
        
        <div *ngIf="loading" class="text-center py-20">
             <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-cyan mx-auto mb-4"></div>
             <p class="text-gray-400">Loading feedback...</p>
        </div>

        <div *ngIf="!loading && feedbackList.length === 0" class="text-center py-20 border border-dashed border-gray-700 rounded-xl">
             <p class="text-gray-500 text-lg">No reviews yet. Check back later!</p>
        </div>

        <div *ngIf="!loading && feedbackList.length > 0" class="grid gap-6">
            <div *ngFor="let item of feedbackList" class="p-6 bg-slate-900/50 border border-gray-800 rounded-xl hover:border-medical-cyan/30 transition group">
                <div class="flex justify-between items-start mb-4">
                    <div class="flex items-center gap-4">
                        <span class="text-4xl">{{ item.rating }}</span>
                        <div>
                            <h4 class="text-medical-cyan font-bold">{{ item.feature }}</h4>
                            <p class="text-xs text-gray-500">{{ item.timestamp | date:'medium' }}</p>
                        </div>
                    </div>
                </div>
                <p class="text-gray-300 leading-relaxed italic">"{{ item.comments || 'No comments provided.' }}"</p>
            </div>
        </div>
    </div>
  `
})
export class Admin implements OnInit {
    private http = inject(HttpClient);
    feedbackList: any[] = [];
    loading = true;

    ngOnInit() {
        this.loadFeedback();
    }

    loadFeedback() {
        this.loading = true;
        this.http.get<any[]>(`${environment.apiUrl}/feedback`).subscribe({
            next: (data) => {
                // Show newest first
                this.feedbackList = data.reverse();
                this.loading = false;
            },
            error: (err) => {
                console.error('Failed to load feedback', err);
                this.loading = false;
            }
        });
    }
}
