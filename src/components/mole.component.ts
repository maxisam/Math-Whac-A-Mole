import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mole } from '../services/game.store';
import { ParticleEffectComponent } from './particle-effect.component';

@Component({
  selector: 'app-mole',
  standalone: true,
  imports: [CommonModule, ParticleEffectComponent],
  template: `
    <div class="relative w-full h-32 flex justify-center items-end overflow-hidden select-none">
      
      <!-- The Hole (Background) -->
      <div class="absolute bottom-0 w-24 h-8 bg-stone-800 rounded-[50%] opacity-40 translate-y-2 z-0"></div>
      <div class="absolute bottom-0 w-24 h-6 bg-stone-900 rounded-[50%] translate-y-3 z-0"></div>

      <!-- The Particle Effect on Hit -->
      @if (mole().isHit) {
        <app-particle-effect />
      }

      <!-- The Mole -->
      <div 
        class="absolute z-10 w-24 h-24 rounded-t-3xl transition-all duration-200 cursor-pointer flex flex-col items-center justify-center shadow-inner border-x-4 border-t-4"
        [class.mole-up]="mole().isUp"
        [class.mole-down]="!mole().isUp"
        [class.bg-amber-600]="!mole().isHit"
        [class.bg-green-500]="mole().isHit && mole().isCorrect"
        [class.bg-red-500]="mole().isHit && !mole().isCorrect"
        [class.border-amber-800]="!mole().isHit"
        [class.border-green-700]="mole().isHit && mole().isCorrect"
        [class.border-red-700]="mole().isHit && !mole().isCorrect"
        [class.hint-glow]="mole().isHinted"
        (click)="onWhack()"
      >
        <div class="pointer-events-none flex flex-col items-center">
            <!-- Mole Face -->
            @if (!mole().isHit) {
                <!-- Eyes -->
                <div class="flex gap-4 mb-1">
                <div class="w-2 h-4 bg-black rounded-full animate-pulse"></div>
                <div class="w-2 h-4 bg-black rounded-full animate-pulse"></div>
                </div>
                <!-- Nose -->
                <div class="w-4 h-3 bg-pink-400 rounded-full mb-1"></div>
            } @else {
                <!-- Hit Face -->
                <div class="text-white font-bold text-xl">
                    @if(mole().isCorrect) {
                        ★
                    } @else {
                        X
                    }
                </div>
            }

            <!-- The Number Plate -->
            <div class="mt-1 bg-white px-2 py-0.5 rounded-lg border-2 border-gray-300 shadow-sm">
            <span class="text-xl font-bold text-gray-800">{{ mole().value }}</span>
            </div>
        </div>
      </div>

      <!-- Dirt / Grass Foreground Mask -->
      <div class="absolute bottom-0 w-full h-4 bg-gradient-to-b from-green-500 to-green-600 z-20 rounded-t-lg"></div>
    </div>
  `
})
export class MoleComponent {
  mole = input.required<Mole>();
  whack = output<number>();

  onWhack() {
    this.whack.emit(this.mole().index);
  }
}