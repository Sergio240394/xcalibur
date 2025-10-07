import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { ModalService } from './core/services/modal.service';
import { LoadingService } from './core/services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingComponent],
  template: `
    <router-outlet></router-outlet>
    <app-loading></app-loading>
  `
})
export class AppComponent {
  title = 'xcalibur';

  private modalService = inject(ModalService);
  private loadingService = inject(LoadingService);

  constructor() {
    // Inicializar el ModalService con el LoadingService
    // Esto hará que los modales automáticamente cierren el cargador
    this.modalService.initializeWithLoadingService(this.loadingService);
    console.log('✅ ModalService inicializado con LoadingService');
  }
}
