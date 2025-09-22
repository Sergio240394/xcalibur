import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IconService {
  private readonly iconMap = new Map<string, string>([
    ['admin', 'assets/icons/admin.svg'],
    ['administrador', 'assets/icons/administrador.svg'],
    ['agreement', 'assets/icons/agreement.svg'],
    ['analytics', 'assets/icons/analytics.svg'],
    ['billing', 'assets/icons/billing.svg'],
    ['briefcase', 'assets/icons/briefcase.svg'],
    ['business', 'assets/icons/business.svg'],
    ['calendar-hr', 'assets/icons/calendar-hr.svg'],
    ['calendar', 'assets/icons/calendar.svg'],
    ['charts', 'assets/icons/charts.svg'],
    ['checklist', 'assets/icons/checklist.svg'],
    ['dashboard', 'assets/icons/dashboard.svg'],
    ['delete', 'assets/icons/delete.svg'],
    ['document', 'assets/icons/document.svg'],
    ['dollar', 'assets/icons/dollar.svg'],
    ['edit', 'assets/icons/edit.svg'],
    ['employee-management', 'assets/icons/employee-management.svg'],
    ['employee', 'assets/icons/employee.svg'],
    ['financial', 'assets/icons/financial.svg'],
    ['pay', 'assets/icons/pay.svg'],
    ['profile', 'assets/icons/profile.svg'],
    ['purchases', 'assets/icons/purchases.svg'],
    ['settings', 'assets/icons/settings.svg'],
    ['team', 'assets/icons/team.svg']
  ]);

  private readonly svgCache = new Map<string, string>();

  constructor(private http: HttpClient) {}

  /**
   * Get the SVG path for a given icon name
   * @param iconName The name of the icon
   * @returns The path to the SVG file
   */


  /**
   * Get SVG content as text
   * @param iconName The name of the icon
   * @returns Observable with SVG content
   */
  getSvgContent(iconName: string): Observable<string> {
    const iconPath = "assets/icons/" + iconName;

    // Check cache first
    if (this.svgCache.has(iconPath)) {
      return of(this.svgCache.get(iconPath)!);
    }

    return this.http.get(iconPath, { responseType: 'text' }).pipe(
      map(svgContent => {
        // Cache the content
        this.svgCache.set(iconPath, svgContent);
        return svgContent;
      }),
      catchError(error => {
        console.error(`Error loading SVG: ${iconPath}`, error);
        return of('<svg></svg>'); // Return empty SVG on error
      })
    );
  }

  /**
   * Check if an icon exists
   * @param iconName The name of the icon
   * @returns True if the icon exists
   */
  hasIcon(iconName: string): boolean {
    return this.iconMap.has(iconName);
  }

  /**
   * Get all available icon names
   * @returns Array of icon names
   */
  getAvailableIcons(): string[] {
    return Array.from(this.iconMap.keys());
  }
}
