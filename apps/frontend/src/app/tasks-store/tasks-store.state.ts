import { Injectable, inject } from '@angular/core';
import { State, Action, Selector, StateContext, Store } from '@ngxs/store';
import { firstValueFrom } from 'rxjs';
import { TasksStoreActions } from './tasks-store.actions';
import { Task } from '../components/tasks-table/tasks-table';
import { TasksApiService, WebSocketMessage } from '../services/tasks-api.service';
import { tryCatch } from '../utils/try-catch';

export interface TasksStoreStateModel {
  tasks: Task[];
  isLoading: boolean;
  isMobile: boolean;
  currentView: 'form' | 'list';
  showMenu: boolean;
}

@State<TasksStoreStateModel>({
  name: 'tasksStore',
  defaults: {
    tasks: [],
    isLoading: false,
    isMobile: false,
    currentView: 'form',
    showMenu: false
  }
})
@Injectable()
export class TasksStoreState {
  private store = inject(Store);
  private tasksApiService = inject(TasksApiService);

  private generateRandomTaskId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private initializeWebSocket(): void {
    this.tasksApiService.initializeWebSocket(
      (message: WebSocketMessage) => {
        console.log('Processing taskUpdated event for taskId:', message.taskId);
        const { taskId, data: { new: newTaskData } } = message;

        this.store?.dispatch(new TasksStoreActions.UpdateTask({
          taskId,
          ...newTaskData
        }));
      },
      (error: Event) => {
        console.error('WebSocket error:', error);
      }
    );
  }

  @Selector()
  static getTasks(state: TasksStoreStateModel): Task[] {
    return state.tasks;
  }

  @Selector()
  static getIsLoading(state: TasksStoreStateModel): boolean {
    return state.isLoading;
  }

  @Selector()
  static getIsMobile(state: TasksStoreStateModel): boolean {
    return state.isMobile;
  }

  @Selector()
  static getCurrentView(state: TasksStoreStateModel): 'form' | 'list' {
    return state.currentView;
  }

  @Selector()
  static getShowMenu(state: TasksStoreStateModel): boolean {
    return state.showMenu;
  }

  @Selector()
  static shouldShowTable(state: TasksStoreStateModel): boolean {
    return !state.isMobile;
  }

  @Selector()
  static shouldShowCards(state: TasksStoreStateModel): boolean {
    return state.isMobile;
  }

  @Action(TasksStoreActions.SetIsMobile)
  setIsMobile(ctx: StateContext<TasksStoreStateModel>, { payload }: TasksStoreActions.SetIsMobile) {
    ctx.patchState({ isMobile: payload });
  }

  @Action(TasksStoreActions.SetCurrentView)
  setCurrentView(ctx: StateContext<TasksStoreStateModel>, { payload }: TasksStoreActions.SetCurrentView) {
    ctx.patchState({ currentView: payload });
  }

  @Action(TasksStoreActions.ToggleMenu)
  toggleMenu(ctx: StateContext<TasksStoreStateModel>) {
    const state = ctx.getState();
    ctx.patchState({ showMenu: !state.showMenu });
  }

  @Action(TasksStoreActions.CloseMenu)
  closeMenu(ctx: StateContext<TasksStoreStateModel>) {
    ctx.patchState({ showMenu: false });
  }

  @Action(TasksStoreActions.InitializeTasks)
  async initializeTasks(ctx: StateContext<TasksStoreStateModel>) {
    // Initialize WebSocket connection
    this.initializeWebSocket();
    // Load initial tasks
    return ctx.dispatch(new TasksStoreActions.RefreshTasks());
  }

  @Action(TasksStoreActions.RefreshTasks)
  async refreshTasks(ctx: StateContext<TasksStoreStateModel>) {
    ctx.patchState({ isLoading: true });

    const result = await tryCatch(firstValueFrom(this.tasksApiService.getTasks()));

    if (result.error === null) {
      ctx.patchState({
        tasks: result.data,
        isLoading: false
      });
      console.log('Tasks refreshed from API:', result.data);
    } else {
      console.error('Error refreshing tasks from API:', result.error);
      ctx.patchState({
        isLoading: false
      });
    }
  }

  @Action(TasksStoreActions.PostTask)
  async postTask(ctx: StateContext<TasksStoreStateModel>, { payload }: TasksStoreActions.PostTask) {
    ctx.patchState({ isLoading: true });
    const taskId = this.generateRandomTaskId();
    const taskData = { taskId, answer: payload.answer };

    const result = await tryCatch(firstValueFrom(this.tasksApiService.createTask(taskData)));

    if (result.error === null) {
      console.log('Task posted successfully:', result.data);

      const state = ctx.getState();
      ctx.patchState({
        tasks: [...state.tasks, result.data],
        isLoading: false
      });
    } else {
      console.error('Error posting task:', result.error);
      ctx.patchState({ isLoading: false });
    }
  }

  @Action(TasksStoreActions.AddTask)
  addTask(ctx: StateContext<TasksStoreStateModel>, { payload }: TasksStoreActions.AddTask) {
    const state = ctx.getState();
    ctx.patchState({
      tasks: [...state.tasks, payload]
    });
  }

  @Action(TasksStoreActions.UpdateTask)
  updateTask(ctx: StateContext<TasksStoreStateModel>, { payload }: TasksStoreActions.UpdateTask) {
    const state = ctx.getState();
    const updatedTasks = state.tasks.map(task =>
      task.taskId === payload.taskId ? { ...task, ...payload } : task
    );
    ctx.patchState({ tasks: updatedTasks });
  }

  /**
   * Clean up WebSocket connection when store is destroyed
   */
  ngOnDestroy(): void {
    this.tasksApiService.closeWebSocket();
  }
}
