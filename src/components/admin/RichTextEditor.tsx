
import React, { useState, useRef, useCallback } from 'react';
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
  Table,
  Minus,
  Type,
  Undo,
  Redo
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Separator } from '@/components/ui/separator';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

interface HistoryState {
  value: string;
  cursor: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your content here...",
  className = ""
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [history, setHistory] = useState<HistoryState[]>([{ value, cursor: 0 }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Add to history when content changes
  const addToHistory = useCallback((newValue: string, cursor: number) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ value: newValue, cursor });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Undo functionality
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const prevState = history[newIndex];
      setHistoryIndex(newIndex);
      onChange(prevState.value);
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(prevState.cursor, prevState.cursor);
        }
      }, 0);
    }
  }, [historyIndex, history, onChange]);

  // Redo functionality
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const nextState = history[newIndex];
      setHistoryIndex(newIndex);
      onChange(nextState.value);
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(nextState.cursor, nextState.cursor);
        }
      }, 0);
    }
  }, [historyIndex, history, onChange]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'z':
          if (e.shiftKey) {
            e.preventDefault();
            handleRedo();
          } else {
            e.preventDefault();
            handleUndo();
          }
          break;
        case 'y':
          e.preventDefault();
          handleRedo();
          break;
        case 'b':
          e.preventDefault();
          insertMarkdown('**', '**');
          break;
        case 'i':
          e.preventDefault();
          insertMarkdown('*', '*');
          break;
      }
    }
  }, [handleUndo, handleRedo]);

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
    
    const newCursorPos = start + prefix.length + before.length + selectedText.length;
    addToHistory(newText, newCursorPos);
    onChange(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
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

  const insertCodeBlock = () => {
    insertMarkdown('```\n', '\n```', true);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursor = e.target.selectionStart;
    
    // Only add to history if it's a significant change (not just typing)
    if (Math.abs(newValue.length - value.length) > 1) {
      addToHistory(newValue, cursor);
    }
    
    onChange(newValue);
  };

  const toolbarButtons = [
    { icon: Bold, label: 'Bold', action: () => insertMarkdown('**', '**'), shortcut: 'Ctrl+B' },
    { icon: Italic, label: 'Italic', action: () => insertMarkdown('*', '*'), shortcut: 'Ctrl+I' },
    { icon: Strikethrough, label: 'Strikethrough', action: () => insertMarkdown('~~', '~~') },
    { icon: Code, label: 'Inline Code', action: () => insertMarkdown('`', '`') },
    { icon: Heading1, label: 'Heading 1', action: () => insertMarkdown('# ', '', true) },
    { icon: Heading2, label: 'Heading 2', action: () => insertMarkdown('## ', '', true) },
    { icon: Heading3, label: 'Heading 3', action: () => insertMarkdown('### ', '', true) },
    { icon: List, label: 'Bullet List', action: () => insertMarkdown('- ', '', true) },
    { icon: ListOrdered, label: 'Numbered List', action: () => insertMarkdown('1. ', '', true) },
    { icon: Quote, label: 'Quote', action: () => insertMarkdown('> ', '', true) },
    { icon: Link, label: 'Link', action: () => insertMarkdown('[', '](url)') },
    { icon: Image, label: 'Image', action: () => insertMarkdown('![alt text](', ')') },
    { icon: Table, label: 'Table', action: insertTable },
    { icon: Minus, label: 'Horizontal Rule', action: () => insertMarkdown('---', '', true) },
  ];

  return (
    <div className={`border rounded-lg ${className}`}>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'edit' | 'preview')}>
        <div className="border-b bg-muted/20">
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center flex-wrap gap-1">
              {/* Undo/Redo buttons */}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                type="button"
                title="Undo (Ctrl+Z)"
              >
                <Undo className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                type="button"
                title="Redo (Ctrl+Y)"
              >
                <Redo className="h-3.5 w-3.5" />
              </Button>
              
              <Separator orientation="vertical" className="h-6 mx-1" />
              
              {toolbarButtons.map((button, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  onClick={button.action}
                  type="button"
                  title={button.shortcut ? `${button.label} (${button.shortcut})` : button.label}
                >
                  <button.icon className="h-3.5 w-3.5" />
                </Button>
              ))}
              <Separator orientation="vertical" className="h-6 mx-1" />
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={insertCodeBlock}
                type="button"
                title="Code Block"
              >
                <Code className="h-3.5 w-3.5 mr-1" />
                <span className="text-xs">Block</span>
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
              💡 Use Markdown: **bold**, *italic*, # heading, - lists, [links](url), ![images](url) | Ctrl+Z to undo, Ctrl+Y to redo
            </p>
          </div>
        </div>

        <TabsContent value="edit" className="mt-0">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={handleContentChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="min-h-[500px] border-0 resize-none focus-visible:ring-0 font-mono text-sm rounded-none"
            style={{ fontFamily: 'ui-monospace, "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace' }}
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <div className="min-h-[500px] p-6 bg-background">
            {value ? (
              <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-muted prose-pre:border prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-table:border prose-th:border prose-td:border prose-th:bg-muted prose-th:p-2 prose-td:p-2">
                <ReactMarkdown
                  components={{
                    code: ({ children, className, ...props }) => {
                      const match = /language-(\w+)/.exec(className || '');
                      const isCodeBlock = match || className?.includes('language-');
                      
                      return isCodeBlock ? (
                        <code className="block bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto" {...props}>
                          {children}
                        </code>
                      ) : (
                        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {value}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <Type className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground text-sm">Nothing to preview yet. Start writing in the Edit tab.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RichTextEditor;
