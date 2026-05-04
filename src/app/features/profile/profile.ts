import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-6xl mx-auto p-8 glass-panel rounded-2xl shadow-xl mt-10">
        <div class="flex items-center gap-6 mb-12 border-b border-gray-800 pb-8">
            <div class="w-24 h-24 bg-gradient-to-tr from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-4xl shadow-lg">
                {{ (auth.currentUser()?.name?.[0] || 'U').toUpperCase() }}
            </div>
            <div>
                <h2 class="text-4xl font-bold text-white">{{ auth.currentUser()?.name }}</h2>
                <p class="text-gray-400">{{ auth.currentUser()?.email }}</p>
                <span class="inline-block mt-2 px-3 py-1 bg-medical-cyan/10 text-medical-cyan text-xs rounded-full border border-medical-cyan/30">Verified Patient</span>
            </div>
        </div>

        <h3 class="text-2xl font-bold text-white mb-6">Your Medical History</h3>
        
        <div *ngIf="loading" class="text-center py-10">
             <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-medical-cyan mx-auto"></div>
        </div>

        <div *ngIf="!loading && history.length === 0" class="text-center py-20 bg-slate-900/30 rounded-xl border border-dashed border-gray-700">
             <p class="text-gray-500">You haven't performed any analyses yet.</p>
        </div>

        <div *ngIf="!loading && history.length > 0" class="grid gap-6">
            <div *ngFor="let item of history" class="p-6 bg-slate-900/50 border border-gray-800 rounded-xl hover:border-medical-cyan/30 transition">
                <div class="flex justify-between items-start mb-4">
                    <span class="px-3 py-1 bg-blue-600/20 text-blue-400 text-xs font-bold rounded-md border border-blue-600/30 uppercase tracking-wider">
                        {{ item.type.replace('-', ' ') }}
                    </span>
                    <span class="text-xs text-gray-500">{{ item.timestamp | date:'medium' }}</span>
                </div>
                
                <div [ngSwitch]="item.type">
                    <!-- Symptoms -->
                    <div *ngSwitchCase="'symptoms'">
                        <p class="text-gray-400 text-sm mb-2">Symptoms: <span class="text-white">{{ item.data.symptoms }}</span></p>
                        <div class="mt-4 p-4 bg-red-600/5 rounded-lg border border-red-600/10">
                            <p class="text-sm font-bold text-red-400 mb-1">Potential Conditions:</p>
                            <p class="text-gray-300">{{ item.data.result.possibleConditions[0]?.condition }}</p>
                        </div>
                    </div>

                    <!-- Interactions -->
                    <div *ngSwitchCase="'drug-interaction'">
                        <p class="text-gray-400 text-sm mb-2">Interaction Check: <span class="text-white">{{ item.data.drug1 }} + {{ item.data.drug2 }}</span></p>
                        <p class="text-gray-300 text-sm italic">"{{ item.data.result.summary }}"</p>
                    </div>

                    <!-- Prescription -->
                    <div *ngSwitchCase="'prescription'">
                        <p class="text-gray-400 text-sm mb-2">Prescription Scan</p>
                        <div class="flex gap-2 flex-wrap">
                            <span *ngFor="let med of item.data.result.medications" class="px-2 py-1 bg-teal-500/10 text-teal-400 text-xs rounded border border-teal-500/20">
                                {{ med.drugName }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `
})
export class Profile implements OnInit {
    auth = inject(AuthService);
    private http = inject(HttpClient);
    
    history: any[] = [];
    loading = true;

    ngOnInit() {
        this.loadHistory();
    }

    loadHistory() {
        this.http.get<any[]>(`${environment.apiUrl}/user/history`).subscribe({
            next: (data) => {
                this.history = data.reverse();
                this.loading = false;
            },
            error: () => this.loading = false
        });
    }
}
