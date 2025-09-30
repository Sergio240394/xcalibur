import { Component, signal, computed, inject, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../../core/services/toast.service';
import { AuthService } from '../../../../core/services/auth.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { environment } from '../../../../../environments/environment';

interface BalanceComprobacionResponse {
  response: {
    pcArchCSV: string;
    pcArchPDF: string;
  };
}

@Component({
  selector: 'app-balance-comprobacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './balance-comprobacion.component.html',
  styleUrls: ['./balance-comprobacion.component.css']
})
export class BalanceComprobacionComponent {
  // Signals
  isLoading = signal(false);
  form: FormGroup;

  // Injected services
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  private loadingService = inject(LoadingService);

  constructor() {
    this.form = this.fb.group({
      compania: ['', [Validators.required]],
      fechaProceso: ['', [Validators.required]]
    });

    // Control the disabled state of form controls based on loading state
    effect(() => {
      const companiaControl = this.form.get('compania');
      const fechaProcesoControl = this.form.get('fechaProceso');

      if (this.isLoading()) {
        companiaControl?.disable();
        fechaProcesoControl?.disable();
      } else {
        companiaControl?.enable();
        fechaProcesoControl?.enable();
      }
    });

    // Inicializar con valores por defecto
    this.initializeForm();
  }

  private initializeForm(): void {
    // Establecer valores por defecto
    this.form.patchValue({
      compania: '1',
      fechaProceso: '2025-01-01'
    });

    console.log('🔧 Form initialized with default values:', {
      compania: this.form.get('compania')?.value,
      fechaProceso: this.form.get('fechaProceso')?.value,
      formValid: this.form.valid
    });
  }

  // Computed properties
  isFormValid = computed(() => {
    const isValid = this.form.valid;
    console.log('🔍 Form validation check:', {
      valid: isValid,
      errors: this.form.errors,
      controls: {
        compania: {
          value: this.form.get('compania')?.value,
          valid: this.form.get('compania')?.valid,
          errors: this.form.get('compania')?.errors
        },
        fechaProceso: {
          value: this.form.get('fechaProceso')?.value,
          valid: this.form.get('fechaProceso')?.valid,
          errors: this.form.get('fechaProceso')?.errors
        }
      }
    });
    return isValid;
  });

  canGenerate = computed(() => {
    const canGen = this.isFormValid() && !this.isLoading();
    console.log('🔍 Can generate check:', {
      formValid: this.isFormValid(),
      isLoading: this.isLoading(),
      canGenerate: canGen
    });
    return canGen;
  });

  onGenerate(): void {
    if (!this.isFormValid()) {
      this.toastService.showError('Por favor complete todos los campos requeridos');
      return;
    }

    this.isLoading.set(true);

    const currentUser = this.authService.user();
    if (!currentUser) {
      this.toastService.showError('Usuario no autenticado');
      this.isLoading.set(false);
      return;
    }

    const formData = this.form.value;
    const params = {
      pcCompania: formData.compania,
      pcFecha: formData.fechaProceso,
      pcLogin: currentUser.pcLogin || '',
      pcSuper: currentUser.pcSuper || false,
      pcToken: currentUser.pcToken || ''
    };

    console.log('🔄 Generando Balance de Comprobación...', params);

    // Mostrar loading global
    this.loadingService.show('Generando Balance de Comprobación...');

    // Llamar al endpoint
    this.http.get<BalanceComprobacionResponse>(
      `${environment.apiUrl}/Getcg2206`,
      { params }
    ).subscribe({
      next: (response) => {
        console.log('✅ Respuesta recibida:', response);
        this.handleResponse(response);
        this.isLoading.set(false);
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('❌ Error al generar Balance de Comprobación:', error);
        this.toastService.showError('Error al generar el Balance de Comprobación');
        this.isLoading.set(false);
        this.loadingService.hide();
      }
    });
  }

  private handleResponse(response: BalanceComprobacionResponse): void {
    const { pcArchCSV, pcArchPDF } = response.response;

    if (!pcArchCSV && !pcArchPDF) {
      this.toastService.showError('No se encontraron archivos para descargar');
      return;
    }

    let downloadCount = 0;

    // Descargar archivo CSV
    if (pcArchCSV) {
      this.downloadFile(pcArchCSV, 'balance-comprobacion.csv', 'text/csv');
      downloadCount++;
    }

    // Descargar archivo PDF
    if (pcArchPDF) {
      this.downloadFile(pcArchPDF, 'balance-comprobacion.pdf', 'application/pdf');
      downloadCount++;
    }

    if (downloadCount > 0) {
      this.toastService.showSuccess(`Balance de Comprobación generado exitosamente. Se descargaron ${downloadCount} archivo(s).`);
    }
  }

  private downloadFile(base64Data: string, filename: string, mimeType: string): void {
    try {
      // Convertir base64 a blob
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });

      // Crear enlace de descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;

      // Simular click para descargar
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Limpiar URL
      window.URL.revokeObjectURL(url);

      console.log(`✅ Archivo ${filename} descargado exitosamente`);
    } catch (error) {
      console.error(`❌ Error al descargar ${filename}:`, error);
      this.toastService.showError(`Error al descargar el archivo ${filename}`);
    }
  }
}
