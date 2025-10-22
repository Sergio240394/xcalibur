import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface MenuItem {
  path: string;
  label: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-search-menu',
  standalone: true,
  // ✅ IMPORTANTE: compatibilidad con Angular + Vite
  imports: [CommonModule, FormsModule, RouterModule],

  templateUrl: 'search-menu.component.html',
  styleUrls: ['search-menu.component.css'],
})
export class SearchMenuComponent {
  @Input() menus: MenuItem[] = [];
  @Output() navigate = new EventEmitter<string>();

  searchTerm = signal('');
  filteredMenus = signal<MenuItem[]>([]);
  showModal = signal(false);

  openModal() {
  this.showModal.set(true);
  this.filteredMenus.set([]); // ✅ Limpia los resultados
  this.searchTerm.set(''); // ✅ Limpia el texto
  setTimeout(() => {
    const input = document.getElementById('global-search-input') as HTMLInputElement;
    input?.focus();
  }, 200);
}

  closeModal() {
    this.showModal.set(false);
    this.searchTerm.set('');
  }

onSearch(term: string) {
  this.searchTerm.set(term);

  // 🔹 Si no hay texto, vacía los resultados
  if (!term.trim()) {
    this.filteredMenus.set([]);
    return;
  }

  const normalized = term.toLowerCase();
  const allMenus = this.flattenMenus(this.menus);
  this.filteredMenus.set(
    allMenus.filter(m => m.label?.toLowerCase().includes(normalized))
  );
}


  // 🧩 Convierte árbol en lista plana
  private flattenMenus(menus: MenuItem[]): MenuItem[] {
    let flat: MenuItem[] = [];
    for (const m of menus) {
      if (m.label && m.path) flat.push({ path: m.path, label: m.label });
      if (m.children) flat = flat.concat(this.flattenMenus(m.children));
    }
    return flat;
  }

  // 🚀 Emite navegación
  goTo(path: string) {
    this.navigate.emit(path);
    this.closeModal();
  }
}
