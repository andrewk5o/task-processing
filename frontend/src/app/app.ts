import { Component, inject } from '@angular/core';
import { TasksSubmissionForm } from './components/tasks-submission-form/tasks-submission-form';
import { TasksTable } from './components/tasks-table/tasks-table';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TasksSubmissionForm, TasksTable],
  template: `
    <main>
      <h1>Task Processing</h1>
      <app-tasks-submission-form></app-tasks-submission-form>
      <app-tasks-table></app-tasks-table>
    </main>
  `,
  styles: [`
    main {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      text-align: center;
      margin-bottom: 30px;
      color: #292830;
      font-family: 'Lato', sans-serif;
    }
  `]
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
