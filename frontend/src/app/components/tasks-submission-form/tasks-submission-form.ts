import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-tasks-submission-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './tasks-submission-form.html',
  styleUrl: './tasks-submission-form.scss'
})
export class TasksSubmissionForm {
  taskForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      answer: ['', [Validators.required, Validators.maxLength(200)]]
    });
  }

  onSubmit() {
    if (this.taskForm.valid) {
      console.log('Form submitted:', this.taskForm.value);
      // Here you would typically send the data to a service
    }
  }

  getCharCount(): number {
    const answerValue = this.taskForm.get('answer')?.value || '';
    return answerValue.length;
  }
}
