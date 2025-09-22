# CollapsibleSectionComponent

Un componente reutilizable para crear secciones que se pueden contraer y expandir con una flecha flotante.

## Uso Básico

```html
<app-collapsible-section>
  <div class="mi-seccion">
    <!-- Contenido de tu sección aquí -->
    <h3>Título de la Sección</h3>
    <p>Contenido que se puede contraer/expandir</p>
  </div>
</app-collapsible-section>
```

## Uso con Estado Inicial

```html
<app-collapsible-section [initialCollapsed]="true">
  <div class="mi-seccion">
    <!-- Esta sección empezará colapsada -->
  </div>
</app-collapsible-section>
```

## Uso Programático

```typescript
import { CollapsibleSectionComponent } from '@shared/components/collapsible-section';

@Component({
  template: `
    <app-collapsible-section #collapsible>
      <div class="mi-seccion">
        <!-- Contenido -->
      </div>
    </app-collapsible-section>
  `
})
export class MiComponente {
  @ViewChild('collapsible') collapsible!: CollapsibleSectionComponent;
  
  expandirSeccion() {
    this.collapsible.expand();
  }
  
  contraerSeccion() {
    this.collapsible.collapse();
  }
  
  alternarSeccion() {
    this.collapsible.toggle();
  }
}
```

## Características

- ✅ **Flecha discreta**: Pequeña y sin fondo, solo aparece al hover
- ✅ **Franja visible**: Cuando está colapsado, muestra una pequeña franja con la flecha
- ✅ **Animaciones suaves**: Transiciones de 0.3s
- ✅ **Accesibilidad**: Soporte para lectores de pantalla
- ✅ **Responsive**: Se adapta a diferentes tamaños
- ✅ **Tema oscuro**: Soporte automático para modo oscuro
- ✅ **No invasivo**: La flecha no interfiere con el contenido

## Estilos

El componente incluye estilos CSS que se aplican automáticamente:

### Estado Expandido:
- Flecha pequeña y discreta (14px)
- Sin fondo, solo aparece al hover
- Color gris suave (#9ca3af)

### Estado Colapsado:
- Franja visible de 40px de altura
- Gradiente sutil de fondo
- Flecha con fondo semi-transparente
- Bordes redondeados
- Efectos hover y active
- Transiciones suaves
- Soporte para tema oscuro

## API

### Inputs
- `initialCollapsed: boolean` - Estado inicial (por defecto: false)

### Métodos
- `toggle()` - Alterna entre expandido/colapsado
- `expand()` - Expande la sección
- `collapse()` - Colapsa la sección

### Propiedades
- `isCollapsed: boolean` - Estado actual (readonly)
- `isExpanded: boolean` - Estado opuesto (readonly)
