# Xcalibur - Sistema de Gestión Empresarial

Un sistema moderno de gestión empresarial construido con Angular 20+ y las mejores prácticas de desarrollo.

## 🚀 Características

- **Angular 20+** con componentes standalone
- **TypeScript estricto** para mayor seguridad de tipos
- **Signals** para gestión de estado reactivo
- **Control flow moderno** (@if, @for, @switch)
- **Diseño responsive** con CSS moderno
- **Autenticación** con guardias de ruta
- **Arquitectura modular** para escalabilidad

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── auth/
│   │   └── login/                 # Componente de login
│   ├── core/
│   │   ├── guards/               # Guardias de autenticación
│   │   ├── interfaces/           # Interfaces TypeScript
│   │   └── services/             # Servicios compartidos
│   ├── dashboard/                # Dashboard principal
│   ├── layout/                   # Layout principal con sidebar
│   └── modules/                  # Módulos funcionales
│       ├── accounts-receivable/  # Cuentas por cobrar
│       ├── accounting/           # Contabilidad
│       ├── inventory/            # Inventario
│       ├── purchases/            # Compras
│       ├── reports/              # Reportes
│       ├── sales/                # Ventas
│       ├── settings/             # Configuración
│       └── treasury/             # Tesorería
```

## 🛠️ Tecnologías Utilizadas

- **Angular 20+** - Framework principal
- **TypeScript** - Lenguaje de programación
- **CSS Moderno** - Estilos con utilidades similares a Tailwind
- **Angular Router** - Navegación entre módulos
- **Angular Signals** - Gestión de estado reactivo

## 🚀 Instalación y Ejecución

### Prerrequisitos

- Node.js 18+ 
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd xcalibur

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start

# Construir para producción
npm run build
```

### Credenciales de Prueba

- **Usuario:** `admin`
- **Contraseña:** `123`

## 🔐 Autenticación

El sistema incluye un flujo de autenticación completo:

- **LoginComponent** - Formulario de inicio de sesión
- **AuthService** - Servicio de autenticación con signals
- **AuthGuard** - Protección de rutas
- **Persistencia** - Almacenamiento en localStorage

## 📱 Características de la UI

- **Diseño responsive** - Adaptable a móviles, tablets y desktop
- **Sidebar colapsible** - Navegación optimizada
- **Tema moderno** - Colores y tipografía profesionales
- **Animaciones suaves** - Transiciones fluidas
- **Iconos emoji** - Interfaz amigable

## 🏗️ Arquitectura

### Componentes Standalone

Todos los componentes utilizan la arquitectura standalone de Angular 20+:

```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  // Lógica del componente
}
```

### Gestión de Estado con Signals

```typescript
export class ExampleService {
  private readonly _data = signal<Data[]>([]);
  public readonly data = this._data.asReadonly();
  
  public updateData(newData: Data[]): void {
    this._data.set(newData);
  }
}
```

### Control Flow Moderno

```html
@if (condition()) {
  <div>Contenido condicional</div>
}

@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
}
```

## 🔧 Configuración

### TypeScript Estricto

El proyecto utiliza configuración estricta de TypeScript:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Estructura de Archivos

- **kebab-case** para nombres de archivos
- **Componentes** terminan en `.component.ts`
- **Servicios** terminan en `.service.ts`
- **Interfaces** terminan en `.interface.ts`

## 📊 Módulos Disponibles

1. **Dashboard** - Vista principal con estadísticas
2. **Cuentas por Cobrar** - Gestión de deudas pendientes
3. **Tesorería** - Control de flujo de caja
4. **Contabilidad** - Registros contables
5. **Inventario** - Gestión de stock
6. **Ventas** - Proceso de ventas
7. **Compras** - Gestión de compras
8. **Reportes** - Análisis y reportes
9. **Configuración** - Ajustes del sistema

## 🚧 Estado del Desarrollo

- ✅ **Login y Autenticación** - Completado
- ✅ **Dashboard** - Completado
- ✅ **Layout y Navegación** - Completado
- ✅ **Estructura Modular** - Completado
- 🔄 **Módulos Funcionales** - En desarrollo (placeholders)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto, contacta al equipo de desarrollo.

---

**Xcalibur** - Potenciando la gestión empresarial con tecnología moderna.
