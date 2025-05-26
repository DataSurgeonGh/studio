"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TextCursorInput, Sparkles, Loader2 } from 'lucide-react';
import { completeVerse, type CompleteVerseInput } from '@/ai/flows/complete-verse';
import { useToast } from '@/hooks/use-toast';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from '../ui/textarea';

interface VerseCompleterProps {
  verseFragment: string; // The current text fragment to complete
  onVerseCompleted: (completedVerse: string) => void;
}

export function VerseCompleter({ verseFragment, onVerseCompleted }: VerseCompleterProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCompleteVerse = async () => {
    if (!verseFragment.trim()) {
      toast({
        title: 'No Text Provided',
        description: 'Please type part of a verse to complete.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setSuggestion(null);
    try {
      const input: CompleteVerseInput = { verseFragment };
      const result = await completeVerse(input);
      if (result && result.completedVerse) {
        setSuggestion(result.completedVerse);
      } else {
        toast({
          title: 'Completion Failed',
          description: 'Could not complete the verse. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Verse completion error:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while completing the verse.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptSuggestion = () => {
    if (suggestion) {
      onVerseCompleted(suggestion);
      setSuggestion(null); // Close popover implicitly by clearing suggestion
    }
  };

  return (
    <Popover open={!!suggestion} onOpenChange={(isOpen) => !isOpen && setSuggestion(null)}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" onClick={handleCompleteVerse} disabled={isLoading} aria-label="Complete Bible verse">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Sparkles className="h-5 w-5 text-accent" />
          )}
        </Button>
      </PopoverTrigger>
      {suggestion && (
        <PopoverContent className="w-80 p-4" align="end">
          <div className="space-y-4">
            <p className="text-sm font-medium">Suggested Completion:</p>
            <Textarea
              readOnly
              value={suggestion}
              className="h-auto min-h-[60px] text-sm bg-muted/50"
              rows={Math.min(5, suggestion.split('\n').length)}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={() => setSuggestion(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleAcceptSuggestion}>
                Insert
              </Button>
            </div>
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
}
