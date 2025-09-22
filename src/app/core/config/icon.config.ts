export const ICON_CONFIG = {
  LUPA: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
</svg>`,

  // Iconos existentes que se pueden migrar gradualmente
  ADMIN: 'admin.svg',
  ADMINISTRADOR: 'administrador.svg',
  AGREEMENT: 'agreement.svg',
  ANALYTICS: 'analytics.svg',
  BILLING: 'billing.svg',
  BRIEFCASE: 'briefcase.svg',
  BUSINESS: 'business.svg',
  CALENDAR_HR: 'calendar-hr.svg',
  CALENDAR: 'calendar.svg',
  CHARTS: 'charts.svg',
  CHECKLIST: 'checklist.svg',
  DASHBOARD: 'dashboard.svg',
  DELETE: 'delete.svg',
  DOCUMENT: 'document.svg',
  DOLLAR: 'dollar.svg',
  EDIT: 'edit.svg',
  EMPLOYEE_MANAGEMENT: 'employee-management.svg',
  EMPLOYEE: 'employee.svg',
  FINANCIAL: 'financial.svg',
  PAY: 'pay.svg',
  PROFILE: 'profile.svg',
  PURCHASES: 'purchases.svg',
  SETTINGS: 'settings.svg',
  TEAM: 'team.svg'
} as const;

export type IconKey = keyof typeof ICON_CONFIG;
