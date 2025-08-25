import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksSubmissionForm } from './tasks-submission-form';

describe('TasksSubmissionForm', () => {
  let component: TasksSubmissionForm;
  let fixture: ComponentFixture<TasksSubmissionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksSubmissionForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksSubmissionForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
