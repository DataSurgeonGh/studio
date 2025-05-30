"use client";
import { cn } from "@/lib/utils";
import type { Note, NoteFormattingOptions } from '@/lib/types';
import { useNotes } from '@/hooks/use-notes';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { TagInput } from './TagInput';
import { VerseModal } from '../ui/verse-modal';
import { FormattingToolbar } from './FormattingToolbar';
import { VerseCompleter } from './VerseCompleter';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Save, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState, useCallback } from 'react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { bibleBooksKJV } from '@/lib/bibleBooks';
import { findAndExtractVerseReferences, fetchBibleVerse } from '@/lib/utils';
interface NoteEditorProps {
  note: Note;
}

// Debounce function
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced as (...args: Parameters<F>) => ReturnType<F>;
}


export function NoteEditor({ note }: NoteEditorProps) {
  const { updateNote, deleteNote, addTagToNote, removeTagFromNote, updateNoteFormatting } = useNotes();
  const { toast } = useToast();
  
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [currentVerseFragment, setCurrentVerseFragment] = useState(''); // For VerseCompleter
  const [bibleBookSearch, setBibleBookSearch] = useState(''); // For Bible book autocomplete
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVerseText, setModalVerseText] = useState('');

  const filteredBibleBooks = bibleBooksKJV.filter(book =>
    book.name.toLowerCase().startsWith(bibleBookSearch.toLowerCase()) ||
    book.abbreviations.some(abbr => abbr.toLowerCase().startsWith(bibleBookSearch.toLowerCase()))
  );

  // Reset local state when `note` prop changes
  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note]);

  const debouncedUpdateNote = useCallback(
    debounce((updatedFields: Partial<Note>) => {
      updateNote(note.id, updatedFields);
      // toast({ title: "Note saved", description: "Changes automatically saved." });
    }, 1000), // 1 second debounce
    [note.id, updateNote, toast]
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    debouncedUpdateNote({ title: e.target.value });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    debouncedUpdateNote({ content: e.target.value });

    // Logic to extract current verse fragment (e.g., current line)
    const cursorPos = e.target.selectionStart;
    const textUntilCursor = e.target.value.substring(0, cursorPos);
    const lastNewline = textUntilCursor.lastIndexOf('\n');
    const currentLine = textUntilCursor.substring(lastNewline + 1);
    setCurrentVerseFragment(currentLine);

    // Logic to detect "@" and subsequent characters for Bible book search
    const atIndex = currentLine.lastIndexOf('@');
    if (atIndex !== -1) {
      const searchString = currentLine.substring(atIndex + 1).trim();
      if (searchString && !searchString.includes(' ')) {
         setBibleBookSearch(searchString);
      } else {
         setBibleBookSearch(''); // Clear search if space is typed after @
      }
    } else {
      setBibleBookSearch(''); // Clear search if @ is not present in the current line
    }
  };

  const handleBookSelect = (bookName: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (textarea) {
      const cursorPos = textarea.selectionStart;
      const textBeforeCursor = textarea.value.substring(0, cursorPos);
      const atIndex = textBeforeCursor.lastIndexOf('@');
      if (atIndex !== -1) {
        const textAfterReplacement = textBeforeCursor.substring(0, atIndex) + bookName + ' ' + textarea.value.substring(cursorPos);
        setContent(textAfterReplacement);
        setBibleBookSearch(''); // Clear search after selection
        // You might want to adjust cursor position after insertion
        textarea.selectionStart = atIndex + bookName.length + 1;
        textarea.selectionEnd = atIndex + bookName.length + 1;
        textarea.focus();
      }
    } else {
      setBibleBookSearch(''); // Clear search if @ is not present in the current line
    }
  };

  const handleFormattingChange = (formatting: Partial<NoteFormattingOptions>) => {
    updateNoteFormatting(note.id, formatting);
    toast({ title: "Formatting Applied", description: `Note formatting updated.` });
  };

  const handleDelete = () => {
    deleteNote(note.id);
    toast({ title: "Note Deleted", description: `"${note.title}" has been deleted.` });
  };
  
  const handleInsertVerse = (verse: string) => {
    // A more sophisticated approach would insert at cursor or replace fragment
    setContent(prev => prev.replace(currentVerseFragment, verse));
    debouncedUpdateNote({ content: content.replace(currentVerseFragment, verse) });
    toast({ title: "Verse Inserted", description: "The completed verse has been inserted." });
  };

  // Function to render content with clickable verse references
  const renderContentWithVerses = (text: string) => {
    const parts = [];
    let lastIndex = 0;
    const verseReferences = findAndExtractVerseReferences(text);

    verseReferences.forEach(ref => {
      const index = text.indexOf(ref, lastIndex);
      if (index > lastIndex) {
        parts.push(<span key={`text-${lastIndex}`}>{text.substring(lastIndex, index)}</span>);
      }
      const handleClick = async () => {
        try {
          const fullVerse = await fetchBibleVerse(ref);
          setModalVerseText(fullVerse);
          setIsModalOpen(true);
        } catch (error) {
          console.error("Failed to fetch verse:", error);
          toast({
            title: "Error fetching verse",
            description: "Could not retrieve the full verse text.",
            variant: "destructive",
          });
        }
      };
      parts.push(<span key={ref} className="verse-reference text-blue-600 cursor-pointer" onClick={handleClick}>[{ref}]</span>);
      lastIndex = index + ref.length;
    });

    if (lastIndex < text.length) {
      parts.push(<span key={`text-${lastIndex}`}>{text.substring(lastIndex)}</span>);
    }
    return parts;
  };
  return (
    <div className="flex flex-col h-full bg-card shadow-lg rounded-r-xl overflow-hidden">
      <header className="p-4 border-b flex items-center justify-between">
        <Input
          value={title}
          onChange={handleTitleChange}
          placeholder="Note Title"
          className="text-xl font-semibold border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 !pl-0"
        />
        <div className="flex items-center space-x-2">
           <VerseCompleter
            verseFragment={currentVerseFragment}
            onVerseCompleted={handleInsertVerse}
          />
          <FormattingToolbar
            currentFontSize={note.fontSize}
            currentLineSpacing={note.lineSpacing}
            onFormattingChange={handleFormattingChange}
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Delete note">
                <Trash2 className="h-5 w-5 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the note titled "{note.title}".
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      <ScrollArea className="flex-grow">
        <Textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Start writing your note here... Type a Bible verse and see the magic!"
          className={cn(
            "h-full min-h-[calc(100vh-250px)] w-full resize-none border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-6 text-base",
            note.fontSize,
            note.lineSpacing
          )}
        />
        {bibleBookSearch && filteredBibleBooks.length > 0 && (
          <ul className="absolute z-10 bg-white border border-gray-200 rounded-md mt-1 w-full max-h-48 overflow-y-auto shadow-lg">
            {filteredBibleBooks.map((book) => (
              <li
                key={book.name}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleBookSelect(book.name)}
              >
                {book.name}
              </li>
            ))}
          </ul>
        )}
      </ScrollArea>

      {/* This div will be used to display styled content with clickable verses */}
      {/* Initially, just displays the plain text content */}
      <div
        className={cn(
 "note-display-content h-full min-h-[calc(100vh-250px)] w-full p-6 text-base",
 note.fontSize,
 note.lineSpacing
 )}
 >{renderContentWithVerses(content)}</div>

      <footer className="p-4 border-t">
        <TagInput
          tags={note.tags}
          onAddTag={(tagName) => addTagToNote(note.id, tagName)}
          onRemoveTag={(tagId) => removeTagFromNote(note.id, tagId)}
        />
      </footer>
    </div>

    <VerseModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      verseText={modalVerseText}
    />
  );
}
