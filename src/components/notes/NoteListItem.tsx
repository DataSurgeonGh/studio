"use client";

import type { Note } from '@/lib/types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns'; // Needs: npm install date-fns
import { Button } from '@/components/ui/button';
import { BookText, Tags, CalendarDays } from 'lucide-react';


interface NoteListItemProps {
  note: Note;
  isActive: boolean;
  onSelect: () => void;
}

export function NoteListItem({ note, isActive, onSelect }: NoteListItemProps) {
  const date = new Date(note.updatedAt);
  const timeAgo = formatDistanceToNow(date, { addSuffix: true });

  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "w-full h-auto justify-start p-3 text-left group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center",
        isActive && "bg-primary/10 dark:bg-primary/20"
      )}
      onClick={onSelect}
      title={note.title}
    >
      <BookText className="h-5 w-5 mr-3 text-primary group-data-[collapsible=icon]:mr-0 group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6" />
      <div className="flex-grow overflow-hidden group-data-[collapsible=icon]:hidden">
        <h3 className="font-medium truncate text-foreground">{note.title}</h3>
        <p className="text-xs text-muted-foreground truncate">{note.content.substring(0, 50) || "Empty note"}{note.content.length > 50 ? "..." : ""}</p>
        <div className="flex items-center text-xs text-muted-foreground mt-1 space-x-2">
          {note.tags.length > 0 && (
            <div className="flex items-center">
              <Tags className="h-3 w-3 mr-1" />
              <span>{note.tags.length} tag{note.tags.length > 1 ? 's' : ''}</span>
            </div>
          )}
          <div className="flex items-center">
             <CalendarDays className="h-3 w-3 mr-1" />
             <span>{timeAgo}</span>
          </div>
        </div>
      </div>
    </Button>
  );
}
