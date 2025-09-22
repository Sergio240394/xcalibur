import { Component, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CollapsibleSectionComponent } from '../../shared/components/collapsible-section/collapsible-section.component';
import { CompanyService, Company } from '../../core/services/company.service';
import { ToastService } from '../../core/services/toast.service';

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
  providers: [
    CompanyService,
    ToastService
  ],
  templateUrl: './carga-comprobantes.component.html',
  styleUrls: ['./carga-comprobantes.component.css']
})
export class CargaComprobantesComponent {
  // Inject services using inject() function
  private readonly fb = inject(FormBuilder);
  private readonly companyService = inject(CompanyService);
  private readonly toastService = inject(ToastService);

  public readonly comprobantesForm!: FormGroup;
  public readonly companiaDescription = signal<string>('');
  public readonly isLoadingCompany = signal<boolean>(false);

  // Popup state
  public readonly showPopup = signal<boolean>(false);
  public readonly popupTitle = signal<string>('');
  public readonly popupItems = signal<Company[]>([]);
  public readonly filteredItems = signal<Company[]>([]);
  public readonly isLoading = signal<boolean>(false);
  public readonly searchTerm = signal<string>('');

  constructor() {
    this.comprobantesForm = this.fb.group({
      compania: ['', Validators.required],
      archivo: [null, Validators.required]
    });

    // Control the disabled state of the company input based on loading state
    effect(() => {
      const companyControl = this.comprobantesForm.get('compania');
      if (this.isLoadingCompany()) {
        companyControl?.disable();
      } else {
        companyControl?.enable();
      }
    });
  }

  public onSubmit(): void {
    if (this.comprobantesForm.valid) {
      console.log('Form submitted:', this.comprobantesForm.value);
      // Implementar lógica de carga
    } else {
      this.comprobantesForm.markAllAsTouched();
    }
  }

  public onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.comprobantesForm.patchValue({ archivo: file });
    }
  }

  public openPopup(type: string): void {
    console.log('🔍 openPopup called with type:', type);
    if (type === 'compania') {
      console.log('📋 Opening company selection popup');
      this.popupTitle.set('Seleccionar Compañía');
      this.showPopup.set(true);
      this.loadCompanies();
    }
  }

  public closePopup(): void {
    this.showPopup.set(false);
    this.searchTerm.set('');
    this.filteredItems.set([]);
    this.popupItems.set([]);
  }

  public loadCompanies(): void {
    console.log('🚀 Loading companies from API...');
    this.isLoading.set(true);
    this.companyService.getCompanies().subscribe({
      next: (companies: Company[]) => {
        console.log('✅ Companies loaded successfully:', companies);
        this.isLoading.set(false);
        this.popupItems.set(companies);
        this.filteredItems.set(companies);
      },
      error: (error: any) => {
        console.error('❌ Error loading companies:', error);
        this.isLoading.set(false);
        this.toastService.showError('Error al cargar las compañías');
      }
    });
  }

  public onSearch(): void {
    const search = this.searchTerm().toLowerCase();
    if (!search) {
      this.filteredItems.set(this.popupItems());
    } else {
      const filtered = this.popupItems().filter(company =>
        company.cia.toString().includes(search) ||
        company['nombre-cia'].toLowerCase().includes(search) ||
        company.nit.includes(search)
      );
      this.filteredItems.set(filtered);
    }
  }

  public onSearchClear(): void {
    this.searchTerm.set('');
    this.filteredItems.set(this.popupItems());
  }

  public selectItem(company: Company): void {
    this.comprobantesForm.patchValue({
      compania: company.cia.toString()
    });
    this.companiaDescription.set(company['nombre-cia']);
    this.closePopup();
  }

  /**
   * Handle company input events (Enter key or blur)
   */
  public onCompanyInput(event: any): void {
    if (event.type === 'keydown' && event.key !== 'Enter') {
      return;
    }

    const companyCode = this.comprobantesForm.get('compania')?.value?.trim();
    if (!companyCode) {
      this.companiaDescription.set('');
      return;
    }

    this.validateCompany(companyCode);
  }

  /**
   * Validate company code by calling the API
   */
  private validateCompany(companyCode: string): void {
    this.isLoadingCompany.set(true);

    this.companyService.getCompanyByCode(companyCode).subscribe({
      next: (company: Company | null) => {
        this.isLoadingCompany.set(false);
        if (company) {
          this.companiaDescription.set(company['nombre-cia']);
        } else {
          this.companiaDescription.set('');
          this.toastService.showError('No se encontró la compañía especificada');
        }
      },
      error: (error: any) => {
        this.isLoadingCompany.set(false);
        this.companiaDescription.set('');
        const errorMessage = error.message || 'Error al validar la compañía';
        this.toastService.showError(errorMessage);
      }
    });
  }

  /**
   * Clear form and reset all fields
   */
  public onClear(): void {
    this.comprobantesForm.reset();
    this.companiaDescription.set('');
    this.searchTerm.set('');
    this.filteredItems.set([]);
    this.popupItems.set([]);
    this.showPopup.set(false);
  }
}
