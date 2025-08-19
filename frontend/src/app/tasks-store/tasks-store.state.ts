import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { TasksStoreAction } from './tasks-store.actions';

export interface TasksStoreStateModel {
  items: string[];
}

@State<TasksStoreStateModel>({
  name: 'tasksStore',
  defaults: {
    items: []
  }
})
@Injectable()
export class TasksStoreState {

  @Selector()
  static getState(state: TasksStoreStateModel) {
    return state;
  }

  @Action(TasksStoreAction)
  add(ctx: StateContext<TasksStoreStateModel>, { payload }: TasksStoreAction) {
    const stateModel = ctx.getState();
    stateModel.items = [...stateModel.items, payload];
    ctx.setState(stateModel);
  }
}
