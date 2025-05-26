
export interface Tag {
  id: string;
  name: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: Tag[];
  createdAt: string; // ISO string date
  updatedAt: string; // ISO string date
  fontSize: 'text-xs' | 'text-sm' | 'text-base' | 'text-lg' | 'text-xl';
  lineSpacing: 'leading-tight' | 'leading-snug' | 'leading-normal' | 'leading-relaxed' | 'leading-loose';
}

export type NoteFormattingOptions = Pick<Note, 'fontSize' | 'lineSpacing'>;
