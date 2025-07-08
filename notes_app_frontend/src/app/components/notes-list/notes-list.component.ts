import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Note } from '../../models/note.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notes-list.component.html',
  styleUrl: './notes-list.component.css'
})
export class NotesListComponent {
  @Input() notes: Note[] = [];
  @Input() selectedNoteId: string | null = null;

  @Output() selectNote = new EventEmitter<string>();
  @Output() deleteNote = new EventEmitter<string>();

  // PUBLIC_INTERFACE
  onNoteSelect(id: string): void {
    this.selectNote.emit(id);
  }

  // PUBLIC_INTERFACE
  onNoteDelete(id: string, event: Event): void {
    event.stopPropagation();
    this.deleteNote.emit(id);
  }
}
