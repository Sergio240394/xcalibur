import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';

import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ModalService } from '../../../core/services/modal.service';
import { ConfirmationDialogComponent } from "../../../shared/components/confirmation-dialog";


@Component({
  selector: 'app-reiniciar-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ConfirmationDialogComponent],
  templateUrl: './reiniciar-password.component.html',
  styleUrls: ['./reiniciar-password.component.css']
})
export class ReiniciarPasswordComponent implements OnInit {

  form: FormGroup;
  isLoading = signal(false);
  apiBase = 'http://184.168.30.44:8810/XcaliburWeb/rest/ServiciosXcaliburWeb';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.form = this.fb.group({
      fechaProceso: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadFechaProceso();
  }

  /** 🔹 Carga la fecha actual desde el servicio GET */
  loadFechaProceso(): void {
    const currentUser = this.authService.user();
    if (!currentUser) {
      this.toastService.showError('No se pudo obtener el usuario actual');
      return;
    }

    this.isLoading.set(true);

    const params = new HttpParams()
      .set('pcFechaProceso', '')
      .set('pcLogin', "currentUser.pcLogin")
      .set('pcSuper', "currentUser.pcSuper")
      .set('pcToken', "currentUser.pcToken");

    const url = `${this.apiBase}/GetLeaveFechaProceso-ge0056`;

    this.http.get<any>(url, { params }).subscribe({
      next: (resp) => {
        this.isLoading.set(false);

        const fecha = resp?.dsRespuesta?.tgeclaves?.[0]?.['fecini-clav'] || null;

        if (fecha) {
          this.form.patchValue({ fechaProceso: fecha });
          this.toastService.showSuccess('Fecha cargada correctamente');
        } else {
          this.toastService.showInfo('No se encontró una fecha válida, seleccione una nueva.');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('❌ Error al obtener fecha', err);
        this.toastService.showError('Error al cargar la fecha de proceso');
      }
    });
  }

  /** 🔹 Actualiza la fecha usando PUT */
  onSubmit(): void {
    if (this.form.invalid) {
      this.toastService.showWarning('Debe seleccionar una fecha válida');
      return;
    }

    const currentUser = this.authService.user();
    if (!currentUser) {
      this.toastService.showError('No se pudo obtener el usuario actual');
      return;
    }

    const fecha = this.form.get('fechaProceso')?.value;
    const params = new HttpParams()
      .set('pcFechaProceso', fecha)
       .set('pcLogin', "currentUser.pcLogin")
      .set('pcSuper', "currentUser.pcSuper")
      .set('pcToken', "currentUser.pcToken");


    const url = `${this.apiBase}/UpdateGeclaves-ge0056`;

    this.isLoading.set(true);
    this.http.put(url, {}, { params }).subscribe({
      next: (resp) => {
        this.isLoading.set(false);
        const mensaje =  'Actualización exitosa';
        this.toastService.showSuccess(mensaje);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('❌ Error al actualizar fecha', err);
        this.toastService.showError('Error al actualizar la fecha de proceso');
      }
    });
  }

  /** 🔹 Limpia el campo */
  onClear(): void {
    this.form.reset();
  }
}
