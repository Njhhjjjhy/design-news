'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Note } from '@/lib/types';

interface PublishModalProps {
  note: Note;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function PublishModal({ note, open, onOpenChange, onConfirm }: PublishModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Publish Note as Blog Post</DialogTitle>
          <DialogDescription>
            This will convert your note into a published blog post. You can still edit it later.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-4">
            <strong>Title:</strong> {note.title}
          </div>
          <div className="mb-4">
            <strong>Categories:</strong>{' '}
            {note.category.length > 0 ? note.category.join(', ') : 'None'}
          </div>
          <div className="text-sm text-muted-foreground">
            The blog post will be accessible at <code>/blog/{note.title.toLowerCase().replace(/\s+/g, '-')}</code>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Publish</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

