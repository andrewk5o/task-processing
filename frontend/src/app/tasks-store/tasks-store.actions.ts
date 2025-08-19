export class TasksStoreAction {
  static readonly type = '[TasksStore] Add item';
  constructor(readonly payload: string) { }
}
