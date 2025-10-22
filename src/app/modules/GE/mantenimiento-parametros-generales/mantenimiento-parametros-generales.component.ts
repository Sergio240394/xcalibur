import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../core/services/toast.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-mantenimiento-parametros-generales',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './mantenimiento-parametros-generales.component.html',
  styleUrls: ['./mantenimiento-parametros-generales.component.css']
})
export class MantenimientoParametrosGeneralesComponent implements OnInit {

  parametrosForm: FormGroup;
  isLoading = signal(false);

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastService: ToastService
  ) {
    this.parametrosForm = this.fb.group({
      logs: [''],
      fondo: [''],
      fondoCampo: [''],
      fondoTexto: [''],
      rectangulo: [''],
      diasAviso: ['', [Validators.pattern(/^[0-9]{0,3}$/)]],
      intentos: ['', [Validators.pattern(/^[0-9]{0,3}$/)]],
      sonido: [''],
      letras: [''],
      idioma: ['ESPAÑOL'],
      letrasTexto: [''],
      diasContrasena: ['', [Validators.pattern(/^[0-9]{0,3}$/)]],
      historia: [''],
      animacion: [''],
      decimales: ['', [Validators.pattern(/^[0-9]{0,3}$/)]],
      fuentes: ['']
    });
  }

  ngOnInit(): void {
    this.loadParametros();
  }

  /** 🔹 Carga los parámetros generales desde el API */
  loadParametros(): void {
    this.isLoading.set(true);
    const apiUrl = `${environment.apiUrl}/GetParametrosGenerales`;

    this.http.get<any>(apiUrl).subscribe({
      next: (data) => {
        this.isLoading.set(false);
        if (data) {
          this.parametrosForm.patchValue(data);
          this.toastService.showSuccess('Parámetros cargados correctamente');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('❌ Error al cargar parámetros', err);
        this.toastService.showError('Error al cargar los parámetros');
      }
    });
  }

  /** 🔹 Envía actualización de parámetros mediante PUT */
  onSubmit(): void {
    if (this.parametrosForm.invalid) {
      this.toastService.showWarning('Por favor, verifique los campos numéricos');
      return;
    }

    const apiUrl = `${environment.apiUrl}/UpdateParametrosGenerales`;
    const payload = this.parametrosForm.value;

    this.isLoading.set(true);
    this.http.put(apiUrl, payload).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.toastService.showSuccess('Parámetros actualizados correctamente');
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('❌ Error al actualizar parámetros', err);
        this.toastService.showError('Error al actualizar los parámetros');
      }
    });
  }

  /** 🔹 Limpia el formulario */
  onClear(): void {
    this.parametrosForm.reset({ idioma: 'ESPAÑOL' });
  }
}
