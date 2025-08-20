import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { AsyncPipe } from '@angular/common';
import { TasksStoreActions } from '../../tasks-store/tasks-store.actions';
import { TasksStoreState } from '../../tasks-store/tasks-store.state';

@Component({
  selector: 'app-tasks-submission-form',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './tasks-submission-form.html',
  styleUrl: './tasks-submission-form.scss'
})
export class TasksSubmissionForm {
  private store = inject(Store);
  taskForm: FormGroup;

  // Use global store loading state
  isLoading = this.store.select(TasksStoreState.getIsLoading);

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      answer: ['', [Validators.required, Validators.maxLength(200)]]
    });
  }

  async onSubmit() {
    if (this.taskForm.valid) {
      const answer = this.taskForm.get('answer')?.value;
      if (answer) {
        try {
          // Post task with generated ID
          await this.store.dispatch(new TasksStoreActions.PostTask({ taskId: '', answer })).toPromise();

          // Reset form after successful submission
          this.taskForm.reset();
        } catch (error) {
          console.error('Error submitting task:', error);
        }
      }
    }
  }

  getCharCount(): number {
    const answerValue = this.taskForm.get('answer')?.value || '';
    return answerValue.length;
  }
}
