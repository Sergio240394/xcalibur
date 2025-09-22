import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-collapsible-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="collapsible-container" [class.collapsed]="isCollapsed()">
      <!-- Floating toggle button -->
      <button
        type="button"
        class="collapsible-toggle"
        (click)="toggle()"
        [title]="isCollapsed() ? 'Expandir sección' : 'Contraer sección'"
        [attr.aria-expanded]="!isCollapsed()"
        aria-label="Toggle section visibility">
        <svg
          class="toggle-icon"
          [class.rotated]="isCollapsed()"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 15l7-7 7 7">
          </path>
        </svg>
      </button>

      <!-- Content -->
      <div class="collapsible-content" [class.hidden]="isCollapsed()">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./collapsible-section.component.css']
})
export class CollapsibleSectionComponent {
  @Input() initialCollapsed: boolean = false;

  private readonly _isCollapsed = signal<boolean>(this.initialCollapsed);

  public readonly isCollapsed = this._isCollapsed.asReadonly();

  public readonly isExpanded = computed(() => !this._isCollapsed());

  toggle(): void {
    this._isCollapsed.update(current => !current);
  }

  expand(): void {
    this._isCollapsed.set(false);
  }

  collapse(): void {
    this._isCollapsed.set(true);
  }
}
