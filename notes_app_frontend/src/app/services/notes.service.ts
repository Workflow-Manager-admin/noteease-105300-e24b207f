import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Observable, from, map } from 'rxjs';

export interface Note {
  id: string;
  title: string;
  content: string;
  created_at?: string;
}

@Injectable({ providedIn: 'root' })
export class NotesService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // PUBLIC_INTERFACE
  /**
   * Fetch all notes, optionally filter by search query.
   */
  getNotes(search: string = ''): Observable<Note[]> {
    let query = this.supabase.from('notes').select('*').order('created_at', { ascending: false });
    if (search) {
      // Filter notes by title or content (case-insensitive)
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }
    return from(query).pipe(map((result: any) => result.data as Note[]));
  }

  // PUBLIC_INTERFACE
  /**
   * Fetch a single note by ID.
   */
  getNoteById(id: string): Observable<Note | null> {
    return from(
      this.supabase.from('notes').select('*').eq('id', id).single()
    ).pipe(map((result: any) => result.data as Note));
  }

  // PUBLIC_INTERFACE
  /**
   * Create a new note.
   */
  createNote(note: Partial<Note>): Observable<Note> {
    return from(
      this.supabase.from('notes').insert([note]).select().single()
    ).pipe(map((result: any) => result.data as Note));
  }

  // PUBLIC_INTERFACE
  /**
   * Update an existing note.
   */
  updateNote(id: string, note: Partial<Note>): Observable<Note> {
    return from(
      this.supabase.from('notes').update(note).eq('id', id).select().single()
    ).pipe(map((result: any) => result.data as Note));
  }

  // PUBLIC_INTERFACE
  /**
   * Delete a note by ID.
   */
  deleteNote(id: string): Observable<void> {
    return from(
      this.supabase.from('notes').delete().eq('id', id)
    ).pipe(map(() => { }));
  }
}
