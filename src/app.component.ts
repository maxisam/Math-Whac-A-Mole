
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStore } from './services/game.store';
import { MoleComponent } from './components/mole.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MoleComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  store = inject(GameStore);

  // Helper to get moles as array for template loop
  get moles() {
    return this.store.moles();
  }
}
