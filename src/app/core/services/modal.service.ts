import { Injectable, signal, effect } from '@angular/core';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private isModalOpen = signal<boolean>(false);
  private loadingService?: LoadingService;

  /**
   * Initialize the modal service with loading service
   * This should be called once in the app initialization
   */
  public initializeWithLoadingService(loadingService: LoadingService): void {
    this.loadingService = loadingService;

    // Efecto: cuando un modal se abre, cierra el loading global
    effect(() => {
      if (this.isModalOpen()) {
        console.log('🚪 Modal abierto - cerrando cargador global');
        this.loadingService?.hide();
      }
    }, { allowSignalWrites: true });
  }

  /**
   * Notifica que un modal se ha abierto
   * Esto automáticamente cerrará el cargador global
   */
  public openModal(): void {
    this.isModalOpen.set(true);
  }

  /**
   * Notifica que un modal se ha cerrado
   */
  public closeModal(): void {
    this.isModalOpen.set(false);
  }

  /**
   * Verifica si hay un modal abierto actualmente
   */
  public hasModalOpen(): boolean {
    return this.isModalOpen();
  }
}

