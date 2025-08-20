import { Injectable, inject } from '@angular/core';
import { State, Action, Selector, StateContext, Store } from '@ngxs/store';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { TasksStoreActions } from './tasks-store.actions';
import { Task } from '../components/tasks-table/tasks-table';

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
  private http = inject(HttpClient);
  private store = inject(Store);
  private apiUrl = 'https://3ac9xpts03.execute-api.eu-central-1.amazonaws.com/tasks';
  private websocketUrl = 'wss://8pd3n4iow3.execute-api.eu-central-1.amazonaws.com/dev';
  private websocket: WebSocket | null = null;

  private generateRandomTaskId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private initializeWebSocket(): void {
    try {
      this.websocket = new WebSocket(this.websocketUrl);

      this.websocket.onopen = (event) => {
        console.log('WebSocket connected:', event);
      };

      this.websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Parsed WebSocket data:', data);

          // Handle taskUpdated event
          if (data.event === 'taskUpdated') {
            console.log('Processing taskUpdated event for taskId:', data.taskId);
            const { taskId, data: { new: newTaskData } } = data;

            this.store?.dispatch(new TasksStoreActions.UpdateTask({
              taskId,
              ...newTaskData
            }));
          }
        } catch (error) {
          console.log('Non-JSON WebSocket message:', event.data);
        }
      };

      this.websocket.onclose = (event) => {
        console.log('WebSocket disconnected:', event);
        setTimeout(() => {
          console.log('Attempting to reconnect WebSocket...');
          this.initializeWebSocket();
        }, 3000);
      };

      this.websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
    }
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

    try {
      const tasks = await firstValueFrom(this.http.get<Task[]>(this.apiUrl));
      ctx.patchState({
        tasks: tasks,
        isLoading: false
      });
      console.log('Tasks refreshed from API:', tasks);
    } catch (error) {
      console.error('Error refreshing tasks from API:', error);
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

    try {
      const response = await firstValueFrom(this.http.post<Task>(this.apiUrl, taskData));
      console.log('Task posted successfully:', response);

      const state = ctx.getState();
      ctx.patchState({
        tasks: [...state.tasks, response],
        isLoading: false
      });
    } catch (error) {
      console.error('Error posting task:', error);
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
}
