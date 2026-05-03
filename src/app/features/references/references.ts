import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-references',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto p-6 glass-panel  rounded-2xl shadow-xl">
        <h2 class="text-3xl font-bold mb-6 text-gray-100  border-b pb-2">Medical References & Citations</h2>
        
        <div class="space-y-6">
            <div class="p-4 border-l-4 border-medical-cyan/30  ">
                 <p class="font-medium text-white ">National Library of Medicine (NLM)</p>
                 <a href="https://pubmed.ncbi.nlm.nih.gov/" target="_blank" class="text-blue-600 dark:text-blue-400 text-sm hover:underline">PubMed Database</a>
                 <p class="text-sm mt-2 text-gray-300 ">Used for validating clinical trial data and peer-reviewed pharmaceutical interactions.</p>
            </div>
            
            <div class="p-4 border-l-4 border-medical-cyan/30  ">
                 <p class="font-medium text-white ">FDA Approved Drug Products (Orange Book)</p>
                 <a href="https://www.fda.gov/drugs" target="_blank" class="text-blue-600 dark:text-blue-400 text-sm hover:underline">Food and Drug Administration (FDA)</a>
                 <p class="text-sm mt-2 text-gray-300 ">Provides fundamental classification for drug safety, generic equivalencies, and active ingredients.</p>
            </div>

            <div class="p-4 border-l-4 border-medical-cyan/30  ">
                 <p class="font-medium text-white ">World Health Organization (WHO)</p>
                 <a href="https://www.who.int/health-topics/medicines" target="_blank" class="text-blue-600 dark:text-blue-400 text-sm hover:underline">Essential Medicines List</a>
                 <p class="text-sm mt-2 text-gray-300 ">Global foundation for OTC safety protocols and universal symptom checkers.</p>
            </div>
        </div>
    </div>
  `
})
export class References {}


