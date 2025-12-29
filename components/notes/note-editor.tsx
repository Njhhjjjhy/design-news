'use client';

import React, { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import { createLowlight, common } from 'lowlight';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Code, 
  Link as LinkIcon,
  Eye,
  EyeOff,
  Save
} from 'lucide-react';
import { marked } from 'marked';
import type { Note, Category } from '@/lib/types';

const categoryOptions: Category[] = [
  'UI',
  'UX',
  'AX',
  'VibeCoding',
  'DesignSystems',
  'Prototypes',
  'ComponentLibraries',
  'Interactions',
];

interface NoteEditorProps {
  note: Note;
  onSave: (note: Note) => void;
  showPreview?: boolean;
}

export function NoteEditor({ note, onSave, showPreview: initialShowPreview = false }: NoteEditorProps) {
  const [showPreview, setShowPreview] = React.useState(initialShowPreview);
  const [title, setTitle] = React.useState(note.title);
  const [categories, setCategories] = React.useState<Category[]>(note.category);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [saveStatus, setSaveStatus] = React.useState<'saved' | 'saving' | 'unsaved'>('saved');

  const lowlight = createLowlight(common);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Placeholder.configure({
        placeholder: 'Start writing your note...',
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
    ],
    content: note.content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4',
      },
    },
    onUpdate: () => {
      setSaveStatus('unsaved');
      // Clear existing timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      // Set new timer for auto-save (30 seconds)
      autoSaveTimerRef.current = setTimeout(() => {
        handleSave();
      }, 30000);
    },
  });

  useEffect(() => {
    if (editor && note.content !== editor.getHTML()) {
      editor.commands.setContent(note.content);
    }
  }, [note.id, editor]);

  useEffect(() => {
    setTitle(note.title);
    setCategories(note.category);
  }, [note.id, note.title, note.category]);

  const handleSave = () => {
    if (!editor) return;
    
    setSaveStatus('saving');
    const updatedNote: Note = {
      ...note,
      title,
      content: editor.getHTML(),
      category: categories,
      updatedAt: new Date(),
    };
    
    onSave(updatedNote);
    setTimeout(() => setSaveStatus('saved'), 500);
  };

  const toggleCategory = (category: Category) => {
    setCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    setSaveStatus('unsaved');
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const htmlContent = editor?.getHTML() || '';
  const markdownContent = editor?.getText() || '';
  const previewHtml = marked.parse(markdownContent);

  if (!editor) {
    return <div className="flex h-96 items-center justify-center">Loading editor...</div>;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <div className="mb-4 flex items-center gap-2">
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setSaveStatus('unsaved');
            }}
            placeholder="Note title..."
            className="text-lg font-semibold"
          />
          <Button onClick={handleSave} size="sm" variant="outline">
            <Save className="mr-2 h-4 w-4" />
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : 'Save'}
          </Button>
        </div>
        
        <div className="mb-4 flex flex-wrap gap-2">
          {categoryOptions.map((cat) => (
            <Badge
              key={cat}
              variant={categories.includes(cat) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => toggleCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-2 border-t pt-2">
          <Button
            onClick={() => editor.chain().focus().toggleBold().run()}
            variant={editor.isActive('bold') ? 'default' : 'outline'}
            size="sm"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            variant={editor.isActive('italic') ? 'default' : 'outline'}
            size="sm"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            variant={editor.isActive('bulletList') ? 'default' : 'outline'}
            size="sm"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            variant={editor.isActive('orderedList') ? 'default' : 'outline'}
            size="sm"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            variant={editor.isActive('codeBlock') ? 'default' : 'outline'}
            size="sm"
          >
            <Code className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button
            onClick={togglePreview}
            variant="outline"
            size="sm"
          >
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span className="ml-2">{showPreview ? 'Edit' : 'Preview'}</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {showPreview ? (
          <div
            className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto p-4"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>
    </div>
  );
}

