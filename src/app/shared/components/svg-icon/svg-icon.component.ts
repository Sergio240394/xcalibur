import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconService } from '../../../core/services/icon.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-svg-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="svg-icon" [style.width]="size" [style.height]="size" [class]="cssClass" #svgContainer>
    </div>
  `,
  styles: [`
    .svg-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      overflow: hidden;
    }

    .svg-icon svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
      display: block;
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  `]
})
export class SvgIconComponent implements OnInit, OnDestroy {
  @Input() iconName: string = '';
  @Input() size: string = '24px';
  @Input() cssClass: string = '';
  @ViewChild('svgContainer', { static: true }) svgContainer!: ElementRef;

  private destroy$ = new Subject<void>();

  constructor(private iconService: IconService) {}

  ngOnInit(): void {
    this.loadSvg();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadSvg(): void {
    this.iconService.getSvgContent(this.iconName)
      .pipe(takeUntil(this.destroy$))
      .subscribe(svgContent => {
        // Clear previous content
        this.svgContainer.nativeElement.innerHTML = '';
        // Insert the SVG content directly
        this.svgContainer.nativeElement.insertAdjacentHTML('beforeend', svgContent);

        // Adjust SVG after insertion
        setTimeout(() => {
          this.adjustSvg();
        }, 0);
      });
  }

  private adjustSvg(): void {
    const svg = this.svgContainer.nativeElement.querySelector('svg');
    if (svg) {
      // Remove fixed width and height attributes
      svg.removeAttribute('width');
      svg.removeAttribute('height');

      // Get the current viewBox
      let viewBox = svg.getAttribute('viewBox');

      // If no viewBox, try to create one from width/height attributes
      if (!viewBox) {
        const width = svg.getAttribute('width') || '24';
        const height = svg.getAttribute('height') || '24';
        viewBox = `0 0 ${width} ${height}`;
        svg.setAttribute('viewBox', viewBox);
      }

      // For very large viewBoxes, normalize to a standard 24x24 size
      if (viewBox) {
        const viewBoxValues = viewBox.split(' ').map((v: string) => parseFloat(v));
        if (viewBoxValues.length >= 4) {
          const [, , width, height] = viewBoxValues;
          // If the viewBox is very large, normalize it to 24x24
          if (width > 1000 || height > 1000) {
            svg.setAttribute('viewBox', '0 0 24 24');
          }
        }
      }

      // Ensure fill and stroke are set to currentColor for CSS control
      svg.setAttribute('fill', 'currentColor');
      svg.setAttribute('stroke', 'currentColor');

      // Set CSS properties for proper scaling
      svg.style.width = '100%';
      svg.style.height = '100%';
      svg.style.maxWidth = '100%';
      svg.style.maxHeight = '100%';
      svg.style.display = 'block';
      svg.style.objectFit = 'contain';
    }
  }
}
