import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

// Contador global de peticiones activas
let activeRequests = 0;

/**
 * Interceptor que muestra/oculta el cargador global automáticamente
 * para TODAS las peticiones HTTP.
 *
 * Cuando un modal se abre, el ModalService se encarga de cerrar
 * el cargador automáticamente, sin necesidad de excepciones aquí.
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // Incrementar contador y mostrar loader
  activeRequests++;

  if (activeRequests === 1) {
    loadingService.show();
  }

  return next(req).pipe(
    finalize(() => {
      // Decrementar contador
      activeRequests--;

      if (activeRequests === 0) {
        loadingService.hide();
      }
    })
  );
};
