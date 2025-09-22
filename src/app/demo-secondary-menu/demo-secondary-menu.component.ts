import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecondaryMenuComponent } from '../shared/components/secondary-menu/secondary-menu.component';

@Component({
  selector: 'app-demo-secondary-menu',
  standalone: true,
  imports: [CommonModule, SecondaryMenuComponent],
  template: `
    <div class="demo-container">
      <div class="demo-header">
        <h1>Demostración del Menú Secundario</h1>
        <p>Este es el menú secundario que omite el nivel 2 y muestra solo los niveles 1 y 3</p>
      </div>

      <div class="demo-content">
        <app-secondary-menu></app-secondary-menu>
      </div>
    </div>
  `,
  styles: [`
    .demo-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 2rem;
    }

    .demo-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .demo-header h1 {
      color: #2d3748;
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .demo-header p {
      color: #4a5568;
      font-size: 1.125rem;
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }

    .demo-content {
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }

    @media (max-width: 768px) {
      .demo-container {
        padding: 1rem;
      }

      .demo-header h1 {
        font-size: 2rem;
      }

      .demo-header p {
        font-size: 1rem;
      }
    }
  `]
})
export class DemoSecondaryMenuComponent {}
