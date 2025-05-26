"use client";

import type { Tag } from '@/lib/types';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Tag as TagIcon } from 'lucide-react';

interface TagInputProps {
  tags: Tag[];
  onAddTag: (tagName: string) => void;
  onRemoveTag: (tagId: string) => void;
}

export function TagInput({ tags, onAddTag, onRemoveTag }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = () => {
    if (inputValue.trim() !== '') {
      onAddTag(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <TagIcon className="h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a tag..."
          className="flex-grow h-9"
        />
        <Button onClick={handleAddTag} variant="outline" size="sm">Add Tag</Button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <Badge key={tag.id} variant="secondary" className="py-1 px-2 text-sm">
              {tag.name}
              <button
                onClick={() => onRemoveTag(tag.id)}
                className="ml-1.5 appearance-none border-none bg-transparent cursor-pointer text-muted-foreground hover:text-foreground"
                aria-label={`Remove tag ${tag.name}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
