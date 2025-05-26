"use client";

import { NoteEditor } from '@/components/notes/NoteEditor';
import { useNotes } from '@/hooks/use-notes';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotesPage() {
  const { activeNote, activeNoteId, setActiveNoteId, isLoading, addNote, notes } = useNotes();
  const searchParams = useSearchParams();
  const router = useRouter();
  const noteIdFromUrl = searchParams.get('id');

  useEffect(() => {
    if (!isLoading) {
      if (noteIdFromUrl) {
        if (noteIdFromUrl !== activeNoteId) {
          setActiveNoteId(noteIdFromUrl);
        }
      } else if (notes.length > 0 && !activeNoteId) {
        // If no ID in URL, but notes exist, select the first one
        // router.push(`/notes?id=${notes[0].id}`);
        // setActiveNoteId(notes[0].id);
        // For now, do nothing, let user select or create
      }
    }
  }, [noteIdFromUrl, activeNoteId, setActiveNoteId, isLoading, router, notes]);

  // Update URL when activeNoteId changes from internal state (e.g. after creating new note)
  useEffect(() => {
    if (activeNoteId && activeNoteId !== noteIdFromUrl) {
      router.replace(`/notes?id=${activeNoteId}`, { scroll: false });
    } else if (!activeNoteId && noteIdFromUrl) {
      // If activeNoteId becomes null (e.g. note deleted) but URL still has id, clear URL id
      router.replace('/notes', { scroll: false });
    }
  }, [activeNoteId, noteIdFromUrl, router]);

  const handleCreateNewNote = () => {
    const newNoteId = addNote();
    router.push(`/notes?id=${newNoteId}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (activeNote) {
    return <NoteEditor note={activeNote} />;
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-background rounded-lg shadow-sm">
      <PackageOpen className="w-16 h-16 text-primary mb-6" />
      <h2 className="text-2xl font-semibold text-foreground mb-2">Welcome to ScriptureScribe</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Select a note from the sidebar to start editing, or create a new one to capture your thoughts and reflections.
      </p>
      <Button onClick={handleCreateNewNote} size="lg">
        Create Your First Note
      </Button>
    </div>
  );
}
