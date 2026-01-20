
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-particle-effect',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="particle-container">
      @for (p of particles; track p) {
        <div class="particle"></div>
      }
    </div>
  `
})
export class ParticleEffectComponent {
  particles = Array.from({ length: 8 });
}
