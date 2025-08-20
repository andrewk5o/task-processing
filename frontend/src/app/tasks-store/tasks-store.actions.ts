import { Task } from '../components/tasks-table/tasks-table';

export namespace TasksStoreActions {
  export class SetIsMobile {
    static readonly type = '[TasksStore] Set Is Mobile';
    constructor(readonly payload: boolean) { }
  }

  export class SetCurrentView {
    static readonly type = '[TasksStore] Set Current View';
    constructor(readonly payload: 'form' | 'list') { }
  }

  export class ToggleMenu {
    static readonly type = '[TasksStore] Toggle Menu';
  }

  export class CloseMenu {
    static readonly type = '[TasksStore] Close Menu';
  }

  export class InitializeTasks {
    static readonly type = '[TasksStore] Initialize Tasks';
  }

  export class RefreshTasks {
    static readonly type = '[TasksStore] Refresh Tasks';
  }

  export class PostTask {
    static readonly type = '[TasksStore] Post Task';
    constructor(readonly payload: { taskId: string; answer: string }) { }
  }

  export class AddTask {
    static readonly type = '[TasksStore] Add Task';
    constructor(readonly payload: Task) { }
  }

  export class UpdateTask {
    static readonly type = '[TasksStore] Update Task';
    constructor(readonly payload: Partial<Task> & { taskId: string }) { }
  }
}
