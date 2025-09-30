import { Component, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CollapsibleSectionComponent } from '../../shared/components/collapsible-section/collapsible-section.component';
import { CompanyService, Company } from '../../core/services/company.service';
import { ToastService } from '../../core/services/toast.service';
import { AuthService } from '../../core/services/auth.service';
import { LoadingService } from '../../core/services/loading.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-carga-comprobantes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    CollapsibleSectionComponent
  ],
  templateUrl: './carga-comprobantes.component.html',
  styleUrls: ['./carga-comprobantes.component.css']
})
export class CargaComprobantesComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly companyService = inject(CompanyService);
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);
  private readonly loadingService = inject(LoadingService);

  public readonly comprobantesForm: FormGroup;
  public readonly companies = signal<Company[]>([]);
  public readonly selectedFile = signal<File | null>(null);

  // Popup properties
  public readonly showPopup = signal<boolean>(false);
  public readonly popupTitle = signal<string>('');
  public readonly searchTerm = signal<string>('');
  public readonly isLoading = signal<boolean>(false);
  public readonly isLoadingCompany = signal<boolean>(false);
  public readonly filteredItems = signal<Company[]>([]);
  public readonly companiaDescription = signal<string>('');

  constructor() {
    this.comprobantesForm = this.fb.group({
      compania: ['', Validators.required],
      archivo: [null, Validators.required]
    });

    // Cargar empresas al inicializar
    this.loadCompanies();
  }

  private loadCompanies(): void {
    this.isLoadingCompany.set(true);
    this.companyService.getCompanies().subscribe({
      next: (companies) => {
        this.companies.set(companies);
        this.isLoadingCompany.set(false);
      },
      error: (error) => {
        this.toastService.showError('Error al cargar las empresas');
        this.isLoadingCompany.set(false);
      }
    });
  }

  public onSubmit(): void {
    if (this.comprobantesForm.valid) {
      const currentUser = this.authService.user();
      if (!currentUser) {
        this.toastService.showError('Usuario no autenticado');
        return;
      }

      const selectedFile = this.selectedFile();
      if (!selectedFile) {
        this.toastService.showError('Por favor selecciona un archivo');
        return;
      }

      this.loadingService.show('Cargando archivo...');

      // Convertir archivo a binario
      this.convertFileToBinary(selectedFile)
        .then(binaryData => {
          this.uploadFile(selectedFile.name, binaryData, currentUser);
        })
        .catch(error => {
          this.toastService.showError('Error al procesar el archivo');
          this.loadingService.hide();
        });
    } else {
      this.toastService.showError('Por favor completa todos los campos requeridos');
    }
  }

  private async convertFileToBinary(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remover el prefijo "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,"
        const base64Data = result.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  private uploadFile(fileName: string, binaryData: string, currentUser: any): void {
    const requestData = {
      ttFile: [
        {
          tcFileName: fileName,
          tclbPayload: binaryData
        }
      ]
    };

    // Usar PUT con el JSON en el body
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.put(`${environment.apiUrl}/CargaArchivosPlanos`, requestData, {
      headers,
      observe: 'response',
      responseType: 'text'
    }).subscribe({
      next: (response) => {
        // Verificar que el status sea 200
        if (response.status === 200) {
          this.toastService.showSuccess('Archivo cargado exitosamente');
          this.loadingService.hide();
          this.onClear(); // Limpiar el formulario después del éxito
        } else {
          this.toastService.showError(`Error inesperado. Status: ${response.status}`);
          this.loadingService.hide();
        }
      },
      error: (error) => {
        // Si el status es 200 pero Angular lo marca como error, tratarlo como éxito
        if (error.status === 200) {
          this.toastService.showSuccess('Archivo cargado exitosamente');
          this.loadingService.hide();
          this.onClear();
        } else {
          this.toastService.showError('Error al cargar el archivo');
          this.loadingService.hide();
        }
      }
    });
  }

  public onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (this.isValidExcelFile(file)) {
        this.selectedFile.set(file);
        this.comprobantesForm.patchValue({ archivo: file });
        this.toastService.showSuccess(`Archivo seleccionado: ${file.name}`);
      } else {
        this.toastService.showError('Por favor selecciona un archivo Excel válido (.xlsx o .xls)');
        event.target.value = ''; // Limpiar el input
      }
    }
  }

  private isValidExcelFile(file: File): boolean {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel' // .xls
    ];
    const allowedExtensions = ['.xlsx', '.xls'];

    const hasValidType = allowedTypes.includes(file.type);
    const hasValidExtension = allowedExtensions.some(ext =>
      file.name.toLowerCase().endsWith(ext)
    );

    return hasValidType || hasValidExtension;
  }

  public onClear(): void {
    this.comprobantesForm.reset();
    this.selectedFile.set(null);
    this.companiaDescription.set('');
    // Limpiar el input de archivo
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  public formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Popup methods
  public openPopup(type: string): void {
    this.popupTitle.set(type === 'compania' ? 'Seleccionar Compañía' : 'Seleccionar Item');
    this.showPopup.set(true);
    this.searchTerm.set('');
    this.filteredItems.set(this.companies());
  }

  public closePopup(): void {
    this.showPopup.set(false);
    this.searchTerm.set('');
    this.filteredItems.set([]);
  }

  public onCompanyInput(event: any): void {
    if (event.type === 'keydown' && event.key === 'Enter') {
      event.preventDefault();
      this.searchCompany();
    } else if (event.type === 'blur') {
      this.searchCompany();
    }
  }

  private searchCompany(): void {
    const companiaValue = this.comprobantesForm.get('compania')?.value;
    if (companiaValue && companiaValue.trim() !== '') {
      const company = this.companies().find(c =>
        c.cia?.toString() === companiaValue.trim()
      );

      if (company) {
        this.companiaDescription.set(company['nombre-cia'] || '');
      } else {
        this.companiaDescription.set('');
        this.toastService.showError('Compañía no encontrada');
      }
    } else {
      this.companiaDescription.set('');
    }
  }

  public onSearch(): void {
    const term = this.searchTerm().toLowerCase();
    if (term.trim() === '') {
      this.filteredItems.set(this.companies());
    } else {
      const filtered = this.companies().filter(company =>
        company['nombre-cia']?.toLowerCase().includes(term) ||
        company.cia?.toString().includes(term)
      );
      this.filteredItems.set(filtered);
    }
  }

  public onSearchClear(): void {
    this.searchTerm.set('');
    this.filteredItems.set(this.companies());
  }

  public selectItem(item: Company): void {
    this.comprobantesForm.patchValue({ compania: item.cia });
    this.companiaDescription.set(item['nombre-cia'] || '');
    this.closePopup();
  }
}
