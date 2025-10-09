import { Component, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <div class="confirmation-overlay" (click)="onCancel()">
        <div class="confirmation-dialog" (click)="$event.stopPropagation()">

          <!-- Title -->
          <h3 class="confirmation-title">{{ title() }}</h3>

          <!-- Message -->
          <p class="confirmation-message">{{ message() }}</p>

          <!-- Buttons -->
          <div class="confirmation-buttons">
            <button
              (click)="onCancel()"
              class="btn-secondary"
              [disabled]="isProcessing()">
              {{ cancelText() }}
            </button>
            <button
              (click)="onConfirm()"
              class="btn-danger"
              [disabled]="isProcessing()">
              @if (isProcessing()) {
                <span class="spinner"></span>
              }
              {{ confirmText() }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .confirmation-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--bg-overlay);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      backdrop-filter: blur(4px);
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .confirmation-dialog {
      background: var(--color-white);
      border-radius: 16px;
      padding: 2rem;
      max-width: 450px;
      width: 90%;
      box-shadow: var(--shadow-xl);
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .confirmation-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-black);
      text-align: center;
      margin: 0 0 1rem 0;
    }

    .confirmation-message {
      color: var(--color-black);
      text-align: center;
      margin: 0 0 2rem 0;
      line-height: 1.6;
    }

    .confirmation-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .confirmation-buttons button {
      flex: 1;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .btn-secondary {
      background: var(--color-gray-500);
      color: var(--text-white);
    }

    .btn-secondary:hover:not(:disabled) {
      background: var(--color-gray-300);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .btn-danger {
      background: var(--color-danger);
      color: var(--text-inverse);
    }

    .btn-danger:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: var(--text-inverse);
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class ConfirmationDialogComponent {
  public readonly isOpen = signal<boolean>(false);
  public readonly title = signal<string>('¿Está seguro?');
  public readonly message = signal<string>('Esta acción no se puede deshacer.');
  public readonly confirmText = signal<string>('Confirmar');
  public readonly cancelText = signal<string>('Cancelar');
  public readonly isProcessing = signal<boolean>(false);

  public readonly confirmed = output<void>();
  public readonly cancelled = output<void>();

  public open(config?: {
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
  }): void {
    if (config?.title) this.title.set(config.title);
    if (config?.message) this.message.set(config.message);
    if (config?.confirmText) this.confirmText.set(config.confirmText);
    if (config?.cancelText) this.cancelText.set(config.cancelText);

    this.isOpen.set(true);
    this.isProcessing.set(false);
  }

  public close(): void {
    this.isOpen.set(false);
    this.isProcessing.set(false);
  }

  public setProcessing(processing: boolean): void {
    this.isProcessing.set(processing);
  }

  public onConfirm(): void {
    if (!this.isProcessing()) {
      this.confirmed.emit();
    }
  }

  public onCancel(): void {
    if (!this.isProcessing()) {
      this.cancelled.emit();
      this.close();
    }
  }
}
