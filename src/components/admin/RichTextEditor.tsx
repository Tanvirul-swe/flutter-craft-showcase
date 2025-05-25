
import React, { useState, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bold, 
  Italic, 
  List, 
  Link, 
  Code, 
  Eye, 
  Edit, 
  Heading1,
  Heading2,
  Heading3,
  ListOrdered,
  Quote,
  Image,
  Strikethrough,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Table,
  Minus
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Separator } from '@/components/ui/separator';

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = (before: string, after: string = '', newLine: boolean = false) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const prefix = newLine && start > 0 && value[start - 1] !== '\n' ? '\n' : '';
    const suffix = newLine ? '\n' : '';
    
    const newText = 
      value.substring(0, start) + 
      prefix + 
      before + 
      selectedText + 
      after + 
      suffix + 
      value.substring(end);
    
    onChange(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const insertTable = () => {
    const tableMarkdown = `
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Row 1    | Data     | Data     |
| Row 2    | Data     | Data     |
`;
    insertMarkdown(tableMarkdown, '', true);
  };

  const toolbarSections = [
    {
      name: 'Text Formatting',
      buttons: [
        { icon: Bold, label: 'Bold', action: () => insertMarkdown('**', '**') },
        { icon: Italic, label: 'Italic', action: () => insertMarkdown('*', '*') },
        { icon: Strikethrough, label: 'Strikethrough', action: () => insertMarkdown('~~', '~~') },
        { icon: Code, label: 'Inline Code', action: () => insertMarkdown('`', '`') },
      ]
    },
    {
      name: 'Headings',
      buttons: [
        { icon: Heading1, label: 'Heading 1', action: () => insertMarkdown('# ', '', true) },
        { icon: Heading2, label: 'Heading 2', action: () => insertMarkdown('## ', '', true) },
        { icon: Heading3, label: 'Heading 3', action: () => insertMarkdown('### ', '', true) },
      ]
    },
    {
      name: 'Lists & Blocks',
      buttons: [
        { icon: List, label: 'Bullet List', action: () => insertMarkdown('- ', '', true) },
        { icon: ListOrdered, label: 'Numbered List', action: () => insertMarkdown('1. ', '', true) },
        { icon: Quote, label: 'Quote', action: () => insertMarkdown('> ', '', true) },
        { icon: Minus, label: 'Horizontal Rule', action: () => insertMarkdown('---', '', true) },
      ]
    },
    {
      name: 'Media & Links',
      buttons: [
        { icon: Link, label: 'Link', action: () => insertMarkdown('[', '](url)') },
        { icon: Image, label: 'Image', action: () => insertMarkdown('![alt text](', ')') },
        { icon: Table, label: 'Table', action: insertTable },
      ]
    }
  ];

  const insertCodeBlock = () => {
    insertMarkdown('```\n', '\n```', true);
  };

  return (
    <div className={`border rounded-lg ${className}`}>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'edit' | 'preview')}>
        <div className="border-b">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center space-x-1 overflow-x-auto">
              {toolbarSections.map((section, sectionIndex) => (
                <React.Fragment key={section.name}>
                  {sectionIndex > 0 && <Separator orientation="vertical" className="h-6 mx-2" />}
                  {section.buttons.map((button, index) => (
                    <Button
                      key={`${section.name}-${index}`}
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 flex-shrink-0"
                      onClick={button.action}
                      type="button"
                      title={button.label}
                    >
                      <button.icon className="h-3.5 w-3.5" />
                    </Button>
                  ))}
                </React.Fragment>
              ))}
              <Separator orientation="vertical" className="h-6 mx-2" />
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 flex-shrink-0"
                onClick={insertCodeBlock}
                type="button"
                title="Code Block"
              >
                <Code className="h-3.5 w-3.5 mr-1" />
                Block
              </Button>
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
          
          <div className="px-3 pb-2">
            <p className="text-xs text-muted-foreground">
              Use Markdown syntax: **bold**, *italic*, # heading, - lists, [links](url), ![images](url)
            </p>
          </div>
        </div>

        <TabsContent value="edit" className="mt-0">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[400px] border-0 resize-none focus-visible:ring-0 font-mono text-sm rounded-none"
            style={{ fontFamily: 'ui-monospace, "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace' }}
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <div className="min-h-[400px] p-4 bg-background">
            {value ? (
              <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-muted prose-pre:border prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-table:border prose-th:border prose-td:border prose-th:bg-muted prose-th:p-2 prose-td:p-2">
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
