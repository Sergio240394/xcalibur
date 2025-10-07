import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isLoading()) {
      <div class="loading-overlay">
          <img src="assets/animation/loader.svg" alt="Cargando..." class="loader-svg">
      </div>
    }
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }

    .loading-spinner {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .loader-svg {
      width: 100px;
      height: 100px;
    }

    .loading-message {
      margin: 0;
      color: #033481;
      font-size: 1rem;
      font-weight: 500;
    }
  `]
})
export class LoadingComponent {
  private loadingService = inject(LoadingService);

  isLoading = this.loadingService.getLoadingState();
  message = this.loadingService.getLoadingMessage();

  constructor() {
    effect(() => {
      if (this.isLoading()) {
        console.log('Cargador global ABIERTO -', this.message());
      } else {
        console.log('Cargador global CERRADO');
      }
    });
  }
}
