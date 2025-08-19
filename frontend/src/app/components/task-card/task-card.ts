import { Component, input } from '@angular/core';
import { StatusBadge } from '../status-badge/status-badge';

export interface Task {
  taskId: string;
  answer: string;
  status: string;
  retries: number;
  errorMessage: string | null;
}

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss',
  imports: [StatusBadge]
})
export class TaskCard {
  task = input.required<Task>();
}
