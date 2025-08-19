import { Component, ChangeDetectionStrategy } from '@angular/core';
import mockTasks from '../../mock-data/tasks.json';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { StatusBadge } from '../status-badge/status-badge';

export interface Task {
  taskId: string;
  answer: string;
  status: 'Processed' | 'Failed' | 'Pending';
  retries: number;
  errorMessage: string | null;
}

@Component({
  selector: 'app-tasks-table',
  standalone: true,
  imports: [MatTableModule, MatIconModule, StatusBadge],
  templateUrl: './tasks-table.html',
  styleUrl: './tasks-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksTable {
  displayedColumns: string[] = ['taskId', 'answer', 'status', 'retries', 'errorMessage'];
  tasks = mockTasks;


  refreshTasks() {
    this.tasks = [...mockTasks];
    console.log('Tasks refreshed');
  }
}
