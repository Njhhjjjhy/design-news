'use client';

import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Note } from '@/lib/types';

interface NoteMetadataProps {
  note: Note;
}

export function NoteMetadata({ note }: NoteMetadataProps) {
  return (
    <div className="space-y-2 border-b p-4 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">Created:</span>
        <span>{format(note.createdAt, 'MMM d, yyyy HH:mm')}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">Updated:</span>
        <span>{format(note.updatedAt, 'MMM d, yyyy HH:mm')}</span>
      </div>
      <Separator />
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">Status:</span>
        <Badge variant={note.status === 'published' ? 'default' : 'secondary'}>
          {note.status}
        </Badge>
      </div>
      {note.category.length > 0 && (
        <>
          <Separator />
          <div className="flex flex-wrap gap-2">
            <span className="text-muted-foreground">Categories:</span>
            {note.category.map((cat) => (
              <Badge key={cat} variant="outline">
                {cat}
              </Badge>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

