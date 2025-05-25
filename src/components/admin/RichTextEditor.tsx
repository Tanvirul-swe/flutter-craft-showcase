
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bold, Italic, List, Link, Code, Eye, Edit } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your content here...",
  className = ""
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.getElementById('markdown-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const toolbarButtons = [
    { icon: Bold, label: 'Bold', action: () => insertMarkdown('**', '**') },
    { icon: Italic, label: 'Italic', action: () => insertMarkdown('*', '*') },
    { icon: Code, label: 'Code', action: () => insertMarkdown('`', '`') },
    { icon: List, label: 'List', action: () => insertMarkdown('\n- ', '') },
    { icon: Link, label: 'Link', action: () => insertMarkdown('[', '](url)') },
  ];

  return (
    <div className={`border rounded-lg ${className}`}>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'edit' | 'preview')}>
        <div className="flex items-center justify-between border-b px-3 py-2">
          <div className="flex items-center space-x-1">
            {toolbarButtons.map((button, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={button.action}
                type="button"
              >
                <button.icon className="h-3.5 w-3.5" />
                <span className="sr-only">{button.label}</span>
              </Button>
            ))}
          </div>
          
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="edit" className="flex items-center gap-1">
              <Edit className="h-3.5 w-3.5" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              Preview
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="edit" className="mt-0">
          <Textarea
            id="markdown-editor"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[300px] border-0 resize-none focus-visible:ring-0 font-mono text-sm"
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <div className="min-h-[300px] p-4">
            {value ? (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{value}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Nothing to preview yet. Start writing in the Edit tab.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RichTextEditor;
