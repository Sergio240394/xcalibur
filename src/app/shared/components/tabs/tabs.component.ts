import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TabItem {
  id: string;
  label: string;
  title: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tabs-container">
      <div class="tabs-header">
        @for (tab of tabs; track tab.id; let i = $index) {
          <button
            type="button"
            class="tab-button"
            [class.active]="activeTabId === tab.id"
            [disabled]="tab.disabled"
            (click)="selectTab(tab.id)"
          >
            {{ tab.label }}
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    .tabs-container {
      margin: 1rem 0;
    }

    .tabs-header {
      display: flex;
      gap: 0;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }

    .tab-button {
      flex: 1;
      padding: 0.75rem 1rem;
      border: none;
      background: var(--color-gray-200);
      color: var(--color-gray-700);
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
      border-right: 1px solid var(--color-gray-300);
      position: relative;
    }

    .tab-button:last-child {
      border-right: none;
    }

    .tab-button:hover:not(:disabled):not(.active) {
      background: var(--color-gray-300);
      color: var(--color-gray-800);
    }

    .tab-button.active {
      background: var(--color-primary);
      color: var(--text-inverse);
      font-weight: 600;
    }

    .tab-button:disabled {
      background: var(--color-gray-100);
      color: var(--color-gray-400);
      cursor: not-allowed;
    }

    .tab-button:focus {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }

    .tab-button:focus:not(:focus-visible) {
      outline: none;
    }
  `]
})
export class TabsComponent {
  @Input() tabs: TabItem[] = [];
  @Input() activeTabId: string = '';
  @Output() tabChanged = new EventEmitter<string>();

  selectTab(tabId: string): void {
    if (this.activeTabId !== tabId) {
      this.tabChanged.emit(tabId);
    }
  }
}
