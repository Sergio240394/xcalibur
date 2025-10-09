import { Component, signal, computed, inject, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingService } from '../../../core/services/loading.service';
import { environment } from '../../../../environments/environment';

interface BalanceComprobacionResponse {
  response: {
    pcArchCSV: string;
    pcArchPDF: string;
  };
}

interface CompaniaResponse {
  dsRespuesta?: {
    tgecias?: Array<{
      cia: number;
      'nombre-cia': string;
      nit: string;
      [key: string]: any;
    }>;
  };
  terrores?: Array<{
    descripcion: string;
    [key: string]: any;
  }>;
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
  companiaName = signal<string>('');
  showPopup = signal<boolean>(false);
  popupTitle = signal<string>('');
  searchTerm = signal<string>('');
  filteredCompanias = signal<any[]>([]);
  allCompanias = signal<any[]>([]);
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
      pcSuper: currentUser.pcSuper || '',
      pcToken: currentUser.pcToken || ''
    };

    console.log('🔄 Consultando Balance de Comprobación...', params);

    // Mostrar loading global
    this.loadingService.show('Consultando Balance de Comprobación...');

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
        console.error('❌ Error al consultar Balance de Comprobación:', error);
        this.toastService.showError('Error al consultar el Balance de Comprobación');
        this.isLoading.set(false);
        this.loadingService.hide();
      }
    });
  }

  onClear(): void {
    this.form.reset();
    this.initializeForm();
    this.toastService.showSuccess('Formulario limpiado');
  }

  onReport(): void {
    if (!this.isFormValid()) {
      this.toastService.showError('Por favor complete todos los campos requeridos');
      return;
    }

    // Llamar a la misma función que onGenerate pero con mensaje diferente
    this.onGenerate();
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

  /**
   * Maneja el evento Enter en el input de compañía
   */
  onCompaniaEnter(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault();
      this.validateCompania();
    }
  }

  /**
   * Maneja el evento blur en el input de compañía
   */
  onCompaniaBlur(): void {
    this.validateCompania();
  }

  /**
   * Valida la compañía ingresada manualmente
   */
  private validateCompania(): void {
    const companiaValue = this.form.get('compania')?.value?.trim();

    if (!companiaValue) {
      this.companiaName.set('');
      return;
    }

    const currentUser = this.authService.user();
    if (!currentUser) {
      this.toastService.showError('Usuario no autenticado');
      return;
    }

    const apiUrl = `${environment.apiUrl}/GetLeaveGEcias?pcCompania=${companiaValue}&pcLogin=${currentUser.pcLogin || ''}&pcSuper=${currentUser.pcSuper || ''}&pcToken=${currentUser.pcToken || ''}`;

    console.log('🔍 Validando compañía:', {
      compania: companiaValue,
      url: apiUrl
    });

    this.http.get<CompaniaResponse>(apiUrl).subscribe({
      next: (response) => {
        console.log('📥 Respuesta GetLeaveGEcias:', response);

        // Verificar si hay errores
        if (response.terrores && response.terrores.length > 0) {
          const error = response.terrores[0];
          this.toastService.showError(error.descripcion || 'No se encontró la compañía');
          this.companiaName.set('');
          return;
        }

        // Verificar si hay datos de compañía
        if (response.dsRespuesta && response.dsRespuesta.tgecias && response.dsRespuesta.tgecias.length > 0) {
          const compania = response.dsRespuesta.tgecias[0];
          this.companiaName.set(compania['nombre-cia'] || '');
          console.log('✅ Compañía encontrada:', compania['nombre-cia']);
        } else {
          this.toastService.showError('No se encontró la compañía');
          this.companiaName.set('');
        }
      },
      error: (error) => {
        console.error('❌ Error al validar compañía:', error);
        this.toastService.showError('Error al validar la compañía');
        this.companiaName.set('');
      }
    });
  }

  /**
   * Abre el popup de búsqueda de compañías
   */
  openPopup(): void {
    this.showPopup.set(true);
    this.popupTitle.set('Seleccionar Compañía');
    this.searchTerm.set('');
    this.loadCompanias();
  }

  /**
   * Cierra el popup de búsqueda
   */
  closePopup(): void {
    this.showPopup.set(false);
    this.searchTerm.set('');
    this.filteredCompanias.set([]);
  }

  /**
   * Carga todas las compañías disponibles
   */
  private loadCompanias(): void {
    const currentUser = this.authService.user();
    if (!currentUser) {
      this.toastService.showError('Usuario no autenticado');
      return;
    }

    const apiUrl = `${environment.apiUrl}/GetCECompanias?pcLogin=${currentUser.pcLogin || ''}&pcSuper=${currentUser.pcSuper || ''}&pcToken=${currentUser.pcToken || ''}`;

    console.log('🔍 Cargando compañías:', apiUrl);

    this.http.get<CompaniaResponse>(apiUrl).subscribe({
      next: (response) => {
        console.log('📥 Respuesta GetCECompanias:', response);

        // Verificar si hay errores
        if (response.terrores && response.terrores.length > 0) {
          const error = response.terrores[0];
          this.toastService.showError(error.descripcion || 'Error al cargar compañías');
          return;
        }

        // Verificar si hay datos de compañías
        if (response.dsRespuesta && response.dsRespuesta.tgecias) {
          this.allCompanias.set(response.dsRespuesta.tgecias);
          this.filteredCompanias.set(response.dsRespuesta.tgecias);
          console.log('✅ Compañías cargadas:', response.dsRespuesta.tgecias.length);
        } else {
          this.toastService.showError('No se encontraron compañías');
        }
      },
      error: (error) => {
        console.error('❌ Error al cargar compañías:', error);
        this.toastService.showError('Error al cargar las compañías');
      }
    });
  }

  /**
   * Filtra las compañías según el término de búsqueda
   */
  onSearchCompanias(): void {
    const term = this.searchTerm().toLowerCase().trim();

    if (!term) {
      this.filteredCompanias.set(this.allCompanias());
      return;
    }

    const filtered = this.allCompanias().filter(compania =>
      compania.cia.toString().includes(term) ||
      compania['nombre-cia'].toLowerCase().includes(term) ||
      compania.nit.includes(term)
    );

    this.filteredCompanias.set(filtered);
  }

  /**
   * Selecciona una compañía del popup
   */
  selectCompania(compania: any): void {
    this.form.patchValue({ compania: compania.cia.toString() });
    this.companiaName.set(compania['nombre-cia']);
    this.closePopup();
    console.log('✅ Compañía seleccionada:', compania['nombre-cia']);
  }
}
