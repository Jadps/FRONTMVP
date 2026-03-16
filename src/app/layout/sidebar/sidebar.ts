import { Component, inject, signal, effect, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { CatalogService } from '../../core/services/catalog.service';
import { ModuleDto } from '../../core/models/module.dto';

export interface SidebarModule extends ModuleDto {
  expanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  public authService = inject(AuthService);
  private catalogService = inject(CatalogService);
  private router = inject(Router);

  public menuItems = signal<SidebarModule[]>([]);

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.loadMenu();
      } else {
        this.menuItems.set([]);
      }
    });
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.syncMenuWithUrl(event.urlAfterRedirects);
    });
  }

  loadMenu() {
    this.catalogService.getMenuModules().subscribe({
      next: (modules) => {
        const mappedModules: SidebarModule[] = modules.map(m => ({ ...m, expanded: false }));
        this.menuItems.set(mappedModules);

        this.syncMenuWithUrl(this.router.url);
      },
      error: () => this.menuItems.set([])
    });
  }

  toggleModule(moduleId: string) {
    this.menuItems.update(modules => {
      return modules.map(m => ({
        ...m,
        expanded: m.id === moduleId ? !m.expanded : false
      }));
    });
  }
  private syncMenuWithUrl(url: string) {
    this.menuItems.update(modules => {
      return modules.map(m => {
        const hasActiveChild = m.subModules?.some(sm => url.includes(sm.action || ''));

        return {
          ...m,
          expanded: hasActiveChild ? true : false
        };
      });
    });
  }
}