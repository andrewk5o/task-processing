import { Component, ChangeDetectionStrategy, inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser, AsyncPipe } from '@angular/common';
import { Store } from '@ngxs/store';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { StatusBadge } from '../status-badge/status-badge';
import { TaskCard } from '../task-card/task-card';
import { TasksStoreState } from '../../tasks-store/tasks-store.state';
import { TasksStoreActions } from '../../tasks-store/tasks-store.actions';

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
  imports: [MatTableModule, MatIconModule, StatusBadge, TaskCard, AsyncPipe],
  templateUrl: './tasks-table.html',
  styleUrl: './tasks-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksTable implements OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private store = inject(Store);

  displayedColumns: string[] = ['taskId', 'answer', 'status', 'retries', 'errorMessage'];

  // State from NGXS store
  tasks = this.store.select(TasksStoreState.getTasks);
  isLoading = this.store.select(TasksStoreState.getIsLoading);
  isMobile = this.store.select(TasksStoreState.getIsMobile);

  // Computed properties for responsive rendering
  shouldShowTable = this.store.select(TasksStoreState.shouldShowTable);
  shouldShowCards = this.store.select(TasksStoreState.shouldShowCards);

  constructor() {
    // Only run on browser platform
    if (isPlatformBrowser(this.platformId)) {
      this.handleResize();
      window.addEventListener('resize', this.handleResize);
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.handleResize);
    }
  }

  private handleResize() {
    const isMobile = window.innerWidth <= 768;
    this.store.dispatch(new TasksStoreActions.SetIsMobile(isMobile));
  }

  refreshTasks() {
    this.store.dispatch(new TasksStoreActions.RefreshTasks());
  }
}
