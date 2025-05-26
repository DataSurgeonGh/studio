"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Note, Tag, NoteFormattingOptions } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid'; // Needs: npm install uuid && npm install @types/uuid

const STORAGE_KEY = 'scripturescribe-notes';

const initialNotes: Note[] = [
  {
    id: uuidv4(),
    title: "John 3:16 Insights",
    content: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.\n\nThis verse is a cornerstone of Christian theology, emphasizing God's love and the gift of salvation through Jesus.",
    tags: [{ id: uuidv4(), name: "Gospel" }, { id: uuidv4(), name: "Salvation" }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fontSize: 'text-base',
    lineSpacing: 'leading-relaxed',
  },
  {
    id: uuidv4(),
    title: "Psalm 23 Reflections",
    content: "The Lord is my shepherd; I shall not want.\nHe makes me lie down in green pastures. He leads me beside still waters.\n\nThis psalm offers comfort and assurance of God's guidance and provision.",
    tags: [{ id: uuidv4(), name: "Psalms" }, { id: uuidv4(), name: "Comfort" }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fontSize: 'text-base',
    lineSpacing: 'leading-relaxed',
  }
];

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteIdState] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedNotes = localStorage.getItem(STORAGE_KEY);
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      } else {
        setNotes(initialNotes);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialNotes));
      }
    } catch (error) {
      console.error("Failed to load notes from localStorage", error);
      setNotes(initialNotes); // Fallback to initial notes
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      } catch (error) {
        console.error("Failed to save notes to localStorage", error);
      }
    }
  }, [notes, isLoading]);

  const setActiveNoteId = useCallback((id: string | null) => {
    setActiveNoteIdState(id);
  }, []);

  const addNote = useCallback(() => {
    const newNote: Note = {
      id: uuidv4(),
      title: 'Untitled Note',
      content: '',
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fontSize: 'text-base',
      lineSpacing: 'leading-relaxed',
    };
    setNotes(prevNotes => [newNote, ...prevNotes]);
    setActiveNoteId(newNote.id);
    return newNote.id;
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === id ? { ...note, ...updates, updatedAt: new Date().toISOString() } : note
      )
    );
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    if (activeNoteId === id) {
      setActiveNoteId(null);
    }
  }, [activeNoteId, setActiveNoteId]);

  const addTagToNote = useCallback((noteId: string, tagName: string) => {
    const newTag: Tag = { id: uuidv4(), name: tagName.trim() };
    if (!newTag.name) return;

    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === noteId
          ? { ...note, tags: [...note.tags.filter(t => t.name.toLowerCase() !== newTag.name.toLowerCase()), newTag], updatedAt: new Date().toISOString() }
          : note
      )
    );
  }, []);

  const removeTagFromNote = useCallback((noteId: string, tagId: string) => {
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === noteId
          ? { ...note, tags: note.tags.filter(tag => tag.id !== tagId), updatedAt: new Date().toISOString() }
          : note
      )
    );
  }, []);
  
  const updateNoteFormatting = useCallback((noteId: string, formatting: Partial<NoteFormattingOptions>) => {
    updateNote(noteId, formatting);
  }, [updateNote]);


  const filteredNotes = notes.filter(note => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      note.title.toLowerCase().includes(searchTermLower) ||
      note.content.toLowerCase().includes(searchTermLower) ||
      note.tags.some(tag => tag.name.toLowerCase().includes(searchTermLower))
    );
  });

  const activeNote = notes.find(note => note.id === activeNoteId) || null;

  return {
    notes: filteredNotes,
    allNotesCount: notes.length,
    activeNote,
    activeNoteId,
    setActiveNoteId,
    addNote,
    updateNote,
    deleteNote,
    addTagToNote,
    removeTagFromNote,
    updateNoteFormatting,
    searchTerm,
    setSearchTerm,
    isLoading,
  };
}
