
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStore } from './services/game.store';
import { MoleComponent } from './components/mole.component';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MoleComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  store = inject(GameStore);
  swUpdate = inject(SwUpdate);

  ngOnInit() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
        .subscribe(() => {
          if (confirm('New version available. Load New Version?')) {
            // Activate the new version and reload the page
            this.swUpdate.activateUpdate().then(() => document.location.reload());
          }
        });
    }
  }

  // Helper to get moles as array for template loop
  get moles() {
    return this.store.moles();
  }
}
