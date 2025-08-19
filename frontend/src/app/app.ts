import { Component, inject, signal } from '@angular/core';
import { TasksSubmissionForm } from './components/tasks-submission-form/tasks-submission-form';
import { TasksTable } from './components/tasks-table/tasks-table';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TasksSubmissionForm, TasksTable, MatIconModule, MatButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private iconRegistry = inject(MatIconRegistry);
  private sanitizer = inject(DomSanitizer);

  // Mobile navigation state
  currentView = signal<'form' | 'list'>('form');
  showMenu = signal(false);

  constructor() {
    this.registerIcons();
  }

  // Mobile navigation methods
  toggleMenu() {
    this.showMenu.update(show => !show);
  }

  closeMenu() {
    this.showMenu.set(false);
  }

  switchView(view: 'form' | 'list') {
    this.currentView.set(view);
  }

  private registerIcons() {
    // Register SVG icons
    this.iconRegistry.addSvgIcon(
      'check-circle',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/check-circle.svg')
    );
    this.iconRegistry.addSvgIcon(
      'close-circle',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/close-circle.svg')
    );
    this.iconRegistry.addSvgIcon(
      'clock',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/clock.svg')
    );
    this.iconRegistry.addSvgIcon(
      'refresh',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/refresh.svg')
    );
    this.iconRegistry.addSvgIcon(
      'menu-alt-3',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/menu.svg')
    );
    this.iconRegistry.addSvgIcon(
      'cog',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/cog.svg')
    );
    this.iconRegistry.addSvgIcon(
      'close',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/close.svg')
    );
    this.iconRegistry.addSvgIcon(
      'list',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/list.svg')
    );
  }
}
