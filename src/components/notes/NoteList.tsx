"use client";

import { useNotes } from '@/hooks/use-notes';
import { NoteListItem } from './NoteListItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

export function NoteList() {
  const { notes, activeNoteId, setActiveNoteId, isLoading, allNotesCount } = useNotes();
  const { setOpenMobile } = useSidebar(); // from "@/components/ui/sidebar"
  const isMobile = useIsMobile();


  const handleNoteSelect = (noteId: string) => {
    setActiveNoteId(noteId);
    if (isMobile) {
      setOpenMobile(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (allNotesCount === 0 && !isLoading) {
     return <p className="text-sm text-muted-foreground p-4 text-center group-data-[collapsible=icon]:hidden">No notes yet. Create one!</p>;
  }

  if (notes.length === 0 && allNotesCount > 0 && !isLoading) {
    return <p className="text-sm text-muted-foreground p-4 text-center group-data-[collapsible=icon]:hidden">No notes match your search.</p>;
  }


  return (
    <ScrollArea className="h-[calc(100vh-220px)] group-data-[collapsible=icon]:h-auto">
      <div className="space-y-1 group-data-[collapsible=icon]:p-0">
        {notes.map(note => (
          <NoteListItem
            key={note.id}
            note={note}
            isActive={note.id === activeNoteId}
            onSelect={() => handleNoteSelect(note.id)}
          />
        ))}
      </div>
    </ScrollArea>
  );
}

// Minimal useSidebar and useIsMobile hook stubs for NoteList to compile.
// These would typically be imported from their actual locations.
const useSidebar = () => ({ setOpenMobile: (open: boolean) => {} });
const useIsMobile = () => false;
