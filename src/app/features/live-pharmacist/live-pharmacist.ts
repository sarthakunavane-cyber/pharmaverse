import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-live-pharmacist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './live-pharmacist.html'
})
export class LivePharmacist {
  translation = inject(TranslationService);

  searchMethod: 'location' | 'manual' = 'manual';
  locationSearchQuery = '';
  loading = false;
  pharmacists = [
      { id: '1', name: 'Dr. Anita Sharma', qualifications: 'Pharm.D, Clinical Specialist', rating: 4.8, experience: '12 years', languages: ['English', 'Hindi'], availability: 'Available Now', cost: '₹300 / consultation', image: 'https://i.pravatar.cc/150?img=47' },
      { id: '2', name: 'Dr. Rajesh Kumar', qualifications: 'M.Pharm, Ayurvedic Expert', rating: 4.6, experience: '8 years', languages: ['Hindi', 'Marathi'], availability: 'Available in 15 mins', cost: '₹250 / consultation', image: 'https://i.pravatar.cc/150?img=11' },
      { id: '3', name: 'Sarah Jenkins', qualifications: 'B.Pharm, RPh', rating: 4.9, experience: '15 years', languages: ['English', 'Spanish'], availability: 'Available Now', cost: '$15 / consultation', image: 'https://i.pravatar.cc/150?img=5' },
      { id: '4', name: 'Dr. Priya Patel', qualifications: 'Pharm.D', rating: 4.7, experience: '5 years', languages: ['English', 'Gujarati', 'Hindi'], availability: 'Available Tomorrow', cost: '₹200 / consultation', image: 'https://i.pravatar.cc/150?img=44' }
  ];

  filteredPharmacists = [...this.pharmacists];

  handleSearch() {
      this.loading = true;
      setTimeout(() => {
          if (this.locationSearchQuery.toLowerCase().includes('india') || this.locationSearchQuery.toLowerCase().includes('delhi') || this.locationSearchQuery.toLowerCase().includes('mumbai')) {
              this.filteredPharmacists = this.pharmacists.filter(p => !p.name.includes('Sarah'));
          } else {
              this.filteredPharmacists = this.pharmacists;
          }
          this.loading = false;
      }, 800);
  }

  requestLocation() {
      this.loading = true;
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
              (position) => {
                   this.locationSearchQuery = "Local Pharmacies near me";
                   this.handleSearch();
              },
              () => {
                  alert(this.translation.t('livePharmacist.locationError'));
                  this.loading = false;
              }
          );
      } else {
          alert('Geolocation not supported');
          this.loading = false;
      }
  }
}

