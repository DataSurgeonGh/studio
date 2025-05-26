"use client";

import type { NoteFormattingOptions } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CaseSensitive, Baseline } from 'lucide-react';

interface FormattingToolbarProps {
  currentFontSize: NoteFormattingOptions['fontSize'];
  currentLineSpacing: NoteFormattingOptions['lineSpacing'];
  onFormattingChange: (formatting: Partial<NoteFormattingOptions>) => void;
}

const fontSizes: NoteFormattingOptions['fontSize'][] = ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl'];
const lineSpacings: NoteFormattingOptions['lineSpacing'][] = ['leading-tight', 'leading-snug', 'leading-normal', 'leading-relaxed', 'leading-loose'];

const fontSizeLabels: Record<NoteFormattingOptions['fontSize'], string> = {
  'text-xs': 'X-Small',
  'text-sm': 'Small',
  'text-base': 'Medium',
  'text-lg': 'Large',
  'text-xl': 'X-Large',
};

const lineSpacingLabels: Record<NoteFormattingOptions['lineSpacing'], string> = {
  'leading-tight': 'Tight',
  'leading-snug': 'Snug',
  'leading-normal': 'Normal',
  'leading-relaxed': 'Relaxed',
  'leading-loose': 'Loose',
};


export function FormattingToolbar({
  currentFontSize,
  currentLineSpacing,
  onFormattingChange,
}: FormattingToolbarProps) {
  return (
    <div className="flex items-center space-x-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Font size">
            <CaseSensitive className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuRadioGroup
            value={currentFontSize}
            onValueChange={(value) => onFormattingChange({ fontSize: value as NoteFormattingOptions['fontSize'] })}
          >
            {fontSizes.map(size => (
              <DropdownMenuRadioItem key={size} value={size}>
                {fontSizeLabels[size]}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Line spacing">
            <Baseline className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuRadioGroup
            value={currentLineSpacing}
            onValueChange={(value) => onFormattingChange({ lineSpacing: value as NoteFormattingOptions['lineSpacing'] })}
          >
            {lineSpacings.map(spacing => (
              <DropdownMenuRadioItem key={spacing} value={spacing}>
                {lineSpacingLabels[spacing]}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
