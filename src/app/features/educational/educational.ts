import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-educational',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto p-6 glass-panel  rounded-2xl shadow-xl">
        <h2 class="text-3xl font-bold mb-6 text-indigo-700 dark:text-indigo-400">Educational Resources</h2>
        <div class="space-y-6 text-gray-200 ">
             <div class="p-4 glass-panel  rounded-lg">
                 <h3 class="font-bold text-lg mb-2">Understanding Drug Interactions</h3>
                 <p>Different medications can interact with each other in ways that can change how they work or increase your risk for certain side effects. Always inform your doctor or pharmacist about all medications, vitamins, and supplements you are taking.</p>
             </div>
             <div class="p-4 glass-panel  rounded-lg">
                 <h3 class="font-bold text-lg mb-2">How to Read a Prescription Label</h3>
                 <p>Your prescription label contains critical information including your doctor's instructions, dosage amounts, the frequency to take the medicine, and important warning labels. Never hesitate to ask a pharmacist to explain your label.</p>
             </div>
             <div class="p-4 glass-panel  rounded-lg">
                 <h3 class="font-bold text-lg mb-2">Safe Storage of Medicines</h3>
                 <p>Store your medicines in a cool, dry place. Avoid keeping them in the bathroom medicine cabinet due to heat and humidity. Always keep medicines out of reach and sight of children and pets.</p>
             </div>
        </div>
    </div>
  `
})
export class Educational {}


