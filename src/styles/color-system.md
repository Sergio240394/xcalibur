# Sistema de Colores - Xcalibur

## 🎨 Variables CSS Centralizadas

Todas las variables de color están definidas en `src/styles.css` usando `:root` para facilitar el mantenimiento y la consistencia.

## 📋 Estructura del Sistema

### Colores Primarios
```css
--color-primary: #3b82f6;           /* Azul principal */
--color-primary-hover: #2563eb;     /* Azul hover */
--color-primary-light: #dbeafe;     /* Azul claro */
--color-primary-dark: #1e40af;      /* Azul oscuro */
```

### Colores Neutrales
```css
--color-white: #ffffff;
--color-gray-50: #f9fafb;           /* Muy claro */
--color-gray-100: #f3f4f6;          /* Claro */
--color-gray-200: #e5e7eb;          /* Medio claro */
--color-gray-300: #d1d5db;          /* Medio */
--color-gray-400: #9ca3af;          /* Medio oscuro */
--color-gray-500: #6b7280;          /* Oscuro */
--color-gray-600: #4b5563;          /* Muy oscuro */
--color-gray-700: #374151;          /* Casi negro */
--color-gray-800: #1f2937;          /* Negro claro */
--color-gray-900: #111827;          /* Negro */
```

### Colores Semánticos
```css
--color-success: #10b981;           /* Verde éxito */
--color-warning: #f59e0b;           /* Amarillo advertencia */
--color-error: #ef4444;             /* Rojo error */
--color-info: #3b82f6;              /* Azul información */
```

### Colores de Fondo
```css
--bg-primary: var(--color-white);   /* Fondo principal */
--bg-secondary: var(--color-gray-50); /* Fondo secundario */
--bg-tertiary: var(--color-gray-100); /* Fondo terciario */
```

### Colores de Texto
```css
--text-primary: var(--color-gray-900);   /* Texto principal */
--text-secondary: var(--color-gray-600); /* Texto secundario */
--text-tertiary: var(--color-gray-500);  /* Texto terciario */
--text-muted: var(--color-gray-400);     /* Texto atenuado */
```

### Colores de Borde
```css
--border-light: var(--color-gray-200);   /* Borde claro */
--border-medium: var(--color-gray-300);  /* Borde medio */
--border-strong: var(--color-gray-400);  /* Borde fuerte */
```

### Sombras
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

## 🌙 Modo Oscuro

El modo oscuro se maneja automáticamente con `@media (prefers-color-scheme: dark)`:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: var(--color-gray-900);
    --text-primary: var(--color-gray-100);
    /* ... más overrides */
  }
}
```

## 🧩 Colores de Componentes

### CollapsibleSection
```css
--collapsible-toggle-bg: transparent;
--collapsible-toggle-hover: rgba(0, 0, 0, 0.05);
--collapsible-toggle-icon: var(--color-gray-400);
--collapsible-strip-bg: linear-gradient(135deg, var(--color-gray-100) 0%, var(--color-gray-200) 100%);
--collapsible-strip-border: var(--color-gray-200);
--collapsible-strip-toggle-bg: rgba(255, 255, 255, 0.9);
--collapsible-strip-toggle-border: var(--color-gray-300);
```

## 📖 Uso

### En CSS
```css
.mi-componente {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-md);
}
```

### En HTML (clases de utilidad)
```html
<div class="bg-white text-gray-900 border-gray-200 shadow-md">
  Contenido
</div>
```

## ✅ Beneficios

1. **Consistencia**: Todos los componentes usan los mismos colores
2. **Mantenimiento**: Cambiar un color actualiza toda la aplicación
3. **Modo Oscuro**: Automático y consistente
4. **Escalabilidad**: Fácil agregar nuevos colores
5. **Performance**: Variables CSS nativas, sin JavaScript

## 🚀 Próximos Pasos

- [ ] Migrar todos los componentes existentes
- [ ] Agregar más colores semánticos
- [ ] Crear tema personalizable
- [ ] Documentar patrones de uso
