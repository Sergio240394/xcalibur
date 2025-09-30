import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-global-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isLoading) {
      <div class="global-loading-overlay">
        <div class="global-loading-container">
          <div class="global-loading-spinner"></div>
          <div class="global-loading-message">{{ loadingMessage }}</div>
        </div>
      </div>
    }
  `,
})
export class GlobalLoadingComponent {
  protected readonly loadingService = inject(LoadingService);

  protected get isLoading(): boolean {
    return this.loadingService.getLoadingState()();
  }

  protected get loadingMessage(): string {
    return this.loadingService.getLoadingMessage()();
  }
}
