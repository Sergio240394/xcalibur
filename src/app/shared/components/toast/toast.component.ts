import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container fixed bottom-4 right-4 z-[9999] space-y-2">
      @for (toast of toasts(); track toast.id) {
        <div
          class="toast-item max-w-sm w-full shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
          [class]="getToastClasses(toast.type)"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                @switch (toast.type) {
                  @case ('success') {
                    <svg class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  @case ('warning') {
                    <svg class="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  }
                  @case ('error') {
                    <svg class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  @case ('info') {
                    <svg class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                }
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-gray-900">
                  {{ toast.message }}
                </p>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      z-index: 9999 !important;
      position: fixed !important;
      bottom: 1rem !important;
      right: 1rem !important;
    }

    .toast-item {
      animation: slideInRight 0.3s ease-out;
      z-index: 10000 !important;
      position: relative !important;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
    }

    .toast-success {
      background: #f0fdf4 !important;
      border-left: 4px solid #22c55e !important;
    }

    .toast-warning {
      background: #fffbeb !important;
      border-left: 4px solid #f59e0b !important;
    }

    .toast-error {
      background: #fef2f2 !important;
      border-left: 4px solid #ef4444 !important;
    }

    .toast-info {
      background: #eff6ff !important;
      border-left: 4px solid #3b82f6 !important;
    }

    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `]
})
export class ToastComponent {
  public readonly toasts;

  constructor(private toastService: ToastService) {
    this.toasts = this.toastService.getToasts;
  }

  public removeToast(id: string): void {
    this.toastService.removeToast(id);
  }

  public getToastClasses(type: string): string {
    switch (type) {
      case 'success':
        return 'toast-success';
      case 'warning':
        return 'toast-warning';
      case 'error':
        return 'toast-error';
      case 'info':
        return 'toast-info';
      default:
        return 'toast-info';
    }
  }
}
