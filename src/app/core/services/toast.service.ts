import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly toasts = signal<ToastMessage[]>([]);

  public readonly getToasts = this.toasts.asReadonly();

  constructor() {}

  /**
   * Muestra un toast de éxito
   * @param message Mensaje a mostrar
   * @param duration Duración en milisegundos (default: 3000)
   */
  public showSuccess(message: string, duration: number = 3000): void {
    this.addToast({
      id: this.generateId(),
      message,
      type: 'success',
      duration
    });
  }

  /**
   * Muestra un toast de advertencia
   * @param message Mensaje a mostrar
   * @param duration Duración en milisegundos (default: 4000)
   */
  public showWarning(message: string, duration: number = 4000): void {
    this.addToast({
      id: this.generateId(),
      message,
      type: 'warning',
      duration
    });
  }

  /**
   * Muestra un toast de error
   * @param message Mensaje a mostrar
   * @param duration Duración en milisegundos (default: 5000)
   */
  public showError(message: string, duration: number = 5000): void {
    this.addToast({
      id: this.generateId(),
      message,
      type: 'error',
      duration
    });
  }

  /**
   * Muestra un toast de información
   * @param message Mensaje a mostrar
   * @param duration Duración en milisegundos (default: 3000)
   */
  public showInfo(message: string, duration: number = 3000): void {
    this.addToast({
      id: this.generateId(),
      message,
      type: 'info',
      duration
    });
  }

  /**
   * Elimina un toast específico
   * @param id ID del toast a eliminar
   */
  public removeToast(id: string): void {
    this.toasts.update(toasts => toasts.filter(toast => toast.id !== id));
  }

  /**
   * Elimina todos los toasts
   */
  public clearAll(): void {
    this.toasts.set([]);
  }

  private addToast(toast: ToastMessage): void {
    this.toasts.update(toasts => [...toasts, toast]);

    // Auto-remove toast after duration
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        this.removeToast(toast.id);
      }, toast.duration);
    }
  }

  private generateId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
