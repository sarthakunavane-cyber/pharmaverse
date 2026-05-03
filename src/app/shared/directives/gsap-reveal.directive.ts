import { Directive, ElementRef, OnInit, OnDestroy } from '@angular/core';
import gsap from 'gsap';

@Directive({
  selector: '[appGsapReveal]',
  standalone: true
})
export class GsapRevealDirective implements OnInit, OnDestroy {
  private observer!: IntersectionObserver;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    // Initial hidden state
    gsap.set(this.el.nativeElement, { opacity: 0, y: 50 });

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.to(this.el.nativeElement, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            delay: 0.1 // Staggering effect could be added here
          });
          this.observer.unobserve(this.el.nativeElement);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    });

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

