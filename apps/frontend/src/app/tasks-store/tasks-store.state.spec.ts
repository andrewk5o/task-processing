import { TestBed } from '@angular/core/testing';
import {  provideStore,  Store } from '@ngxs/store';
import { TasksStoreState, TasksStoreStateModel } from './tasks-store.state';
import { TasksStoreAction } from './tasks-store.actions';

describe('TasksStore store', () => {
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
       providers: [provideStore([TasksStoreState])]
      
    });

    store = TestBed.inject(Store);
  });

  it('should create an action and add an item', () => {
    const expected: TasksStoreStateModel = {
      items: ['item-1']
    };
    store.dispatch(new TasksStoreAction('item-1'));
    const actual = store.selectSnapshot(TasksStoreState.getState);
    expect(actual).toEqual(expected);
  });

});
