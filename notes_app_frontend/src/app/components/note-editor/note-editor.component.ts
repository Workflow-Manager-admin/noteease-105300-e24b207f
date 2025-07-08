import { Component, EventEmitter, Input, Output, SimpleChanges, OnChanges } from '@angular/core';
import { Note } from '../../models/note.model';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-note-editor',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './note-editor.component.html',
  styleUrl: './note-editor.component.css'
})
export class NoteEditorComponent implements OnChanges {
  @Input() note: Note | null = null; // If null: "create" mode.
  @Output() save = new EventEmitter<{ title: string; content: string }>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(fb: FormBuilder) {
    this.form = fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      content: ['', [Validators.maxLength(1000)]]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['note']) {
      if (this.note) {
        this.form.setValue({ title: this.note.title, content: this.note.content });
      } else {
        this.form.reset({ title: '', content: '' });
      }
    }
  }

  // PUBLIC_INTERFACE
  onSubmit(): void {
    if (this.form.valid) {
      const payload = {
        title: this.form.value.title ?? '',
        content: this.form.value.content ?? ''
      };
      this.save.emit(payload);
      this.form.reset({ title: '', content: '' });
    }
  }

  // PUBLIC_INTERFACE
  onCancel(): void {
    this.cancel.emit();
  }
}
