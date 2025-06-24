
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Calendar } from 'lucide-react';
import { useNotes, Note } from '@/hooks/useNotes';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { formatDistanceToNow } from 'date-fns';

export default function PublicNote() {
  const { id } = useParams<{ id: string }>();
  const { getPublicNote } = useNotes();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNote = async () => {
      if (!id) {
        setError('Invalid note ID');
        setLoading(false);
        return;
      }

      try {
        const fetchedNote = await getPublicNote(id);
        if (fetchedNote) {
          setNote(fetchedNote);
        } else {
          setError('Note not found or not public');
        }
      } catch (err) {
        setError('Failed to load note');
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, getPublicNote]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Note Not Found</h2>
            <p className="text-muted-foreground">
              {error || 'This note might not exist or is not publicly available.'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="container mx-auto">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold">DevNotes</h1>
            <Globe className="w-5 h-5 text-green-600" />
            <span className="text-sm text-muted-foreground">Public Note</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="space-y-4">
              <CardTitle className="text-3xl">{note.title}</CardTitle>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Created {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
                  </span>
                </div>
                {note.updated_at !== note.created_at && (
                  <span>
                    • Updated {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
                  </span>
                )}
              </div>

              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="prose prose-slate max-w-none">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-md"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={`${className} bg-slate-100 rounded px-1 py-0.5`} {...props}>
                        {children}
                      </code>
                    );
                  },
                  h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-2xl font-semibold mt-6 mb-3">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-xl font-medium mt-4 mb-2">{children}</h3>,
                  p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-slate-300 pl-4 italic text-slate-600 my-4">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {note.content}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
