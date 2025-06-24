
import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Save, Eye, EyeOff, X } from 'lucide-react';
import { Note } from '@/hooks/useNotes';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface NoteEditorProps {
  note?: Note;
  onSave: (title: string, content: string, tags: string[], isPublic: boolean) => void;
  onCancel?: () => void;
}

export const NoteEditor = ({ note, onSave, onCancel }: NoteEditorProps) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [isPublic, setIsPublic] = useState(note?.is_public || false);
  const [showPreview, setShowPreview] = useState(false);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    if (!title.trim()) return;
    onSave(title, content, tags, isPublic);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave();
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {note ? 'Edit Note' : 'Create Note'}
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPreview ? 'Edit' : 'Preview'}
          </Button>
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button onClick={handleSave} disabled={!title.trim()}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Title Input */}
      <Input
        placeholder="Note title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyPress={handleKeyPress}
        className="text-lg font-semibold"
      />

      {/* Tags Input */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Add tags..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
            className="flex-1"
          />
          <Button type="button" onClick={handleAddTag} variant="outline" size="sm">
            Add Tag
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="cursor-pointer">
                {tag}
                <X
                  className="w-3 h-3 ml-1"
                  onClick={() => handleRemoveTag(tag)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Public Toggle */}
      <div className="flex items-center space-x-2">
        <Switch
          checked={isPublic}
          onCheckedChange={setIsPublic}
        />
        <label className="text-sm">Make this note public</label>
      </div>

      {/* Content Editor/Preview */}
      <div className="flex-1 min-h-0">
        {showPreview ? (
          <div className="h-full overflow-auto border rounded-md p-4 bg-white">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        ) : (
          <Textarea
            placeholder="Start writing your note in markdown..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-full resize-none font-mono"
            onKeyPress={handleKeyPress}
          />
        )}
      </div>
    </div>
  );
};
