import { Component, inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngxs/store';
import { TasksSubmissionForm } from './components/tasks-submission-form/tasks-submission-form';
import { TasksTable } from './components/tasks-table/tasks-table';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TasksStoreActions } from './tasks-store/tasks-store.actions';
import { TasksStoreState } from './tasks-store/tasks-store.state';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TasksSubmissionForm, TasksTable, MatIconModule, MatButtonModule, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnDestroy {
  private iconRegistry = inject(MatIconRegistry);
  private sanitizer = inject(DomSanitizer);
  private platformId = inject(PLATFORM_ID);
  private store = inject(Store);
  private resizeHandler: (() => void) | null = null;

  // State from NGXS store
  currentView = this.store.select(TasksStoreState.getCurrentView);
  showMenu = this.store.select(TasksStoreState.getShowMenu);

  constructor() {
    this.registerIcons();
    this.initializeResponsiveBehavior();
    this.initializeApp();
  }

  private initializeApp() {
    // Initialize tasks from API on app startup
    this.store.dispatch(new TasksStoreActions.InitializeTasks());
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId) && this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
  }

  // Mobile navigation methods
  toggleMenu() {
    this.store.dispatch(new TasksStoreActions.ToggleMenu());
  }

  closeMenu() {
    this.store.dispatch(new TasksStoreActions.CloseMenu());
  }

  switchView(view: 'form' | 'list') {
    this.store.dispatch(new TasksStoreActions.SetCurrentView(view));
  }

  private initializeResponsiveBehavior() {
    // Only run on browser platform
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
      this.resizeHandler = () => this.checkScreenSize();
      window.addEventListener('resize', this.resizeHandler);
    }
  }

  private checkScreenSize() {
    const isMobile = window.innerWidth <= 768;
    this.store.dispatch(new TasksStoreActions.SetIsMobile(isMobile));
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
