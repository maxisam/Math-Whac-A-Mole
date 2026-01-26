

import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection, isDevMode } from '@angular/core';
import { AppComponent } from './src/app.component';
import { provideServiceWorker } from '@angular/service-worker';

const isAmazonSilk = () => {
  return navigator.userAgent.includes('Silk');
};

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode() && !isAmazonSilk(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
}).catch((err) => console.error(err));


// AI Studio always uses an `index.tsx` file for all project types.