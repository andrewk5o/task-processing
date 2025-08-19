import { Component, ChangeDetectionStrategy, signal, computed, effect, inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import mockTasks from '../../mock-data/tasks.json';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { StatusBadge } from '../status-badge/status-badge';
import { TaskCard } from '../task-card/task-card';

export interface Task {
  taskId: string;
  answer: string;
  status: string;
  retries: number;
  errorMessage: string | null;
}

@Component({
  selector: 'app-tasks-table',
  standalone: true,
  imports: [MatTableModule, MatIconModule, StatusBadge, TaskCard],
  templateUrl: './tasks-table.html',
  styleUrl: './tasks-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksTable implements OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private resizeHandler: (() => void) | null = null;

  displayedColumns: string[] = ['taskId', 'answer', 'status', 'retries', 'errorMessage'];
  tasks = mockTasks;

  // Responsive state
  isMobile = signal(false);
  isLoading = signal(false);

  // Computed properties for responsive rendering
  shouldShowTable = computed(() => !this.isMobile());
  shouldShowCards = computed(() => this.isMobile());

  constructor() {
    // Only run on browser platform
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
      this.resizeHandler = () => this.checkScreenSize();
      window.addEventListener('resize', this.resizeHandler);
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId) && this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
  }

  private checkScreenSize() {
    this.isMobile.set(window.innerWidth <= 768);
  }

  async refreshTasks() {
    this.isLoading.set(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.tasks = [...mockTasks];
      console.log('Tasks refreshed');
    } finally {
      this.isLoading.set(false);
    }
  }
}
