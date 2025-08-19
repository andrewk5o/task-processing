import { Component, inject } from '@angular/core';
import { TasksSubmissionForm } from './components/tasks-submission-form/tasks-submission-form';
import { TasksTable } from './components/tasks-table/tasks-table';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TasksSubmissionForm, TasksTable],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private iconRegistry = inject(MatIconRegistry);
  private sanitizer = inject(DomSanitizer);

  constructor() {
    this.registerIcons();
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
  }
}
