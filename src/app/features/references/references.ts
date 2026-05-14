import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-references',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './references.html'
})
export class References {
    links = [
        'https://ipc.gov.in',
        'https://pubmed.ncbi.nlm.nih.gov/',
        'https://www.fda.gov/drugs',
        'https://www.who.int/health-topics/medicines'
    ];

    openAllReferences() {
        if (typeof window !== 'undefined') {
            this.links.forEach(link => window.open(link, '_blank'));
        }
    }
}


