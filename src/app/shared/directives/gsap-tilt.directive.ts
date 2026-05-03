import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';
import gsap from 'gsap';

@Directive({
  selector: '[appGsapTilt]',
  standalone: true
})
export class GsapTiltDirective implements OnInit {
  constructor(private el: ElementRef) {}

  ngOnInit() {
    gsap.set(this.el.nativeElement, { transformPerspective: 1000, transformStyle: 'preserve-3d' });
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left; // x position within the element.
    const y = event.clientY - rect.top;  // y position within the element.
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation based on cursor position relative to center
    const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
    const rotateY = ((x - centerX) / centerX) * 10;
    
    gsap.to(this.el.nativeElement, {
      duration: 0.5,
      rotateX: rotateX,
      rotateY: rotateY,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    gsap.to(this.el.nativeElement, {
      duration: 0.8,
      rotateX: 0,
      rotateY: 0,
      ease: 'elastic.out(1, 0.3)',
      overwrite: 'auto'
    });
  }
}

