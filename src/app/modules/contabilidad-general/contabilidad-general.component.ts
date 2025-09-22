import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-contabilidad-general',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="contabilidad-general-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .contabilidad-general-container {
      min-height: 100vh;
      background: var(--bg-primary);
    }
  `]
})
export class ContabilidadGeneralComponent {}
