import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctors-corner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto p-6 glass-panel  rounded-2xl shadow-xl border-t-4 border-emerald-500">
        <h2 class="text-3xl font-bold mb-6 text-emerald-700 dark:text-emerald-400">Doctor's Corner</h2>
        <p class="text-gray-300  mb-8">Professional insights, clinical guidelines, and continuing medical education resources.</p>
        
        <div class="grid md:grid-cols-2 gap-6">
            <div class="border border-medical-cyan/30 dark:border-medical-cyan/30 p-5 rounded-xl hover:shadow-md transition">
                <h3 class="font-bold text-lg mb-2 ">Latest Clinical Guidelines</h3>
                <p class="text-sm text-gray-300 ">Access the most recent updates on hypertension management and diabetic care protocols.</p>
                <a href="#" class="text-emerald-600 dark:text-emerald-400 font-semibold text-sm inline-block mt-3">Read More →</a>
            </div>
            <div class="border border-medical-cyan/30 dark:border-medical-cyan/30 p-5 rounded-xl hover:shadow-md transition">
                <h3 class="font-bold text-lg mb-2 ">Case Studies</h3>
                <p class="text-sm text-gray-300 ">Review complex patient presentations involving polypharmacy resolutions.</p>
                <a href="#" class="text-emerald-600 dark:text-emerald-400 font-semibold text-sm inline-block mt-3">Read More →</a>
            </div>
            <div class="border border-medical-cyan/30 dark:border-medical-cyan/30 p-5 rounded-xl hover:shadow-md transition">
                <h3 class="font-bold text-lg mb-2 ">CME Opportunities</h3>
                <p class="text-sm text-gray-300 ">Find upcoming webinars and approved continuing medical education courses.</p>
                <a href="#" class="text-emerald-600 dark:text-emerald-400 font-semibold text-sm inline-block mt-3">Read More →</a>
            </div>
        </div>
    </div>
  `
})
export class DoctorsCorner {}


