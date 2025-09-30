import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private isLoading = signal<boolean>(false);
  private loadingMessage = signal<string>('Cargando...');

  /**
   * Get the current loading state
   */
  public getLoadingState() {
    return this.isLoading.asReadonly();
  }

  /**
   * Get the current loading message
   */
  public getLoadingMessage() {
    return this.loadingMessage.asReadonly();
  }

  /**
   * Show loading with optional custom message
   * @param message Custom loading message (optional)
   */
  public show(message?: string): void {
    if (message) {
      this.loadingMessage.set(message);
    } else {
      this.loadingMessage.set('Cargando...');
    }
    this.isLoading.set(true);
  }

  /**
   * Hide loading
   */
  public hide(): void {
    this.isLoading.set(false);
  }

  /**
   * Check if currently loading
   */
  public isCurrentlyLoading(): boolean {
    return this.isLoading();
  }
}
