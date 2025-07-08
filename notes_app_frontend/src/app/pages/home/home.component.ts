import { Component, OnInit } from '@angular/core';
import { NotesService, Note } from '../../services/notes.service';
import { NotesListComponent } from '../../components/notes-list/notes-list.component';
import { NoteEditorComponent } from '../../components/note-editor/note-editor.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NotesListComponent,
    NoteEditorComponent,
    SidebarComponent,
    HeaderComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  notes: Note[] = [];
  filteredNotes: Note[] = [];
  selectedNote: Note | null = null;
  searching: boolean = false;
  loading: boolean = false;
  searchTerm: string = '';
  showEditor: boolean = false;
  isEditing: boolean = false;

  constructor(public notesService: NotesService) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    void this.notesService;
  }

  ngOnInit() {
    this.fetchNotes();
  }

  // PUBLIC_INTERFACE
  fetchNotes(): void {
    this.loading = true;
    this.notesService.getNotes(this.searchTerm).subscribe((notes) => {
      this.notes = notes;
      this.filteredNotes = notes;
      // If possible, preserve selection after a refresh
      if (this.selectedNote) {
        const again = notes.find(n => n.id === this.selectedNote!.id);
        this.selectedNote = again ?? null;
      }
      this.loading = false;
    });
  }

  // PUBLIC_INTERFACE
  onSelectNote(id: string): void {
    this.selectedNote = this.notes.find(n => n.id === id) ?? null;
    this.isEditing = false;
    this.showEditor = false;
  }

  // PUBLIC_INTERFACE
  onDeleteNote(id: string): void {
    // Support SSR and satisfy strict lint: only access confirm if typeof window exists
    const canConfirm = typeof globalThis !== 'undefined' && typeof (globalThis as any).confirm === 'function';
    const confirmed = canConfirm ? (globalThis as any).confirm('Are you sure you want to delete this note?') : true;
    if (confirmed) {
      this.notesService.deleteNote(id).subscribe(() => {
        this.fetchNotes();
        if (this.selectedNote && this.selectedNote.id === id) {
          this.selectedNote = null;
          this.showEditor = false;
        }
      });
    }
  }

  // PUBLIC_INTERFACE
  onSearch(term: string | Event): void {
    // Fixes wrong value type
    if (typeof term === 'string') {
      this.searchTerm = term;
      this.fetchNotes();
    }
  }

  // PUBLIC_INTERFACE
  onEditNote(): void {
    this.isEditing = true;
    this.showEditor = true;
  }

  // PUBLIC_INTERFACE
  onCreateNote(): void {
    this.selectedNote = null;
    this.isEditing = false;
    this.showEditor = true;
  }

  // PUBLIC_INTERFACE
  onSaveNote(data: { title: string; content: string }): void {
    if (this.selectedNote && this.isEditing) {
      this.notesService.updateNote(this.selectedNote.id, data).subscribe(() => {
        this.fetchNotes();
        this.showEditor = false;
        this.isEditing = false;
      });
    } else {
      this.notesService.createNote(data).subscribe((newNote) => {
        this.fetchNotes();
        this.selectedNote = newNote;
        this.showEditor = false;
      });
    }
  }

  // PUBLIC_INTERFACE
  onCancelEdit(): void {
    this.showEditor = false;
    this.isEditing = false;
  }
}
