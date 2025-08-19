import { Injectable, signal } from '@angular/core';

export enum TaskStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export interface Task {
  taskId: string;
  answer: string;
  status: TaskStatus;
  retries: number;
  errorMessage?: string;
}

export interface CreateTaskRequest {
  taskId: string;
  answer: string;
}

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private tasks = signal<Task[]>([]);

  getAllTasks() {
    return this.tasks();
  }

  addTask(request: CreateTaskRequest) {
    const newTask: Task = {
      taskId: request.taskId,
      answer: request.answer,
      status: TaskStatus.PENDING,
      retries: 0,
      errorMessage: undefined
    };

    this.tasks.update(tasks => [...tasks, newTask]);
    return newTask;
  }

  updateTask(taskId: string, updates: Partial<Omit<Task, 'taskId'>>) {
    this.tasks.update(tasks =>
      tasks.map(task =>
        task.taskId === taskId ? { ...task, ...updates } : task
      )
    );
  }
}
