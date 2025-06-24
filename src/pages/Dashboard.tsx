
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Plus, Search, LogOut, Filter } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNotes, Note } from '@/hooks/useNotes';
import { NoteCard } from '@/components/NoteCard';
import { NoteEditor } from '@/components/NoteEditor';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const { user, signOut, loading: authLoading } = useAuth();
  const { notes, loading, createNote, updateNote, deleteNote } = useNotes();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    notes.forEach(note => {
      note.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [notes]);

  // Filter notes based on search and tags
  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch = !searchTerm || 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => note.tags.includes(tag));
      
      return matchesSearch && matchesTags;
    });
  }, [notes, searchTerm, selectedTags]);

  const handleCreateNote = async (title: string, content: string, tags: string[], isPublic: boolean) => {
    const newNote = await createNote(title, content, tags);
    if (newNote) {
      setIsEditorOpen(false);
    }
  };

  const handleUpdateNote = async (title: string, content: string, tags: string[], isPublic: boolean) => {
    if (!editingNote) return;
    
    const updated = await updateNote(editingNote.id, {
      title,
      content,
      tags,
      is_public: isPublic
    });
    
    if (updated) {
      setIsEditorOpen(false);
      setEditingNote(undefined);
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  const handleDeleteNote = async (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      await deleteNote(id);
    }
  };

  const handleShareNote = (note: Note) => {
    const url = `${window.location.origin}/public/${note.id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "The public link has been copied to your clipboard"
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">DevNotes</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user.email}
            </span>
            <Button variant="outline" onClick={signOut} size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              {allTags.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <div className="flex flex-wrap gap-2">
                    {allTags.slice(0, 5).map(tag => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                    {allTags.length > 5 && (
                      <Badge variant="outline" className="cursor-pointer">
                        +{allTags.length - 5} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
            <Sheet open={isEditorOpen} onOpenChange={setIsEditorOpen}>
              <SheetTrigger asChild>
                <Button onClick={() => setEditingNote(undefined)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Note
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-4xl p-0">
                <NoteEditor
                  note={editingNote}
                  onSave={editingNote ? handleUpdateNote : handleCreateNote}
                  onCancel={() => {
                    setIsEditorOpen(false);
                    setEditingNote(undefined);
                  }}
                />
              </SheetContent>
            </Sheet>
          </div>
          
          {selectedTags.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Filtered by:</span>
              {selectedTags.map(tag => (
                <Badge key={tag} variant="default" className="cursor-pointer" onClick={() => toggleTag(tag)}>
                  {tag} ✕
                </Badge>
              ))}
              <Button variant="ghost" size="sm" onClick={() => setSelectedTags([])}>
                Clear filters
              </Button>
            </div>
          )}
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {notes.length === 0 ? "No notes yet. Create your first note!" : "No notes match your search."}
            </p>
            {notes.length === 0 && (
              <Sheet open={isEditorOpen} onOpenChange={setIsEditorOpen}>
                <SheetTrigger asChild>
                  <Button onClick={() => setEditingNote(undefined)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Note
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-4xl p-0">
                  <NoteEditor
                    onSave={handleCreateNote}
                    onCancel={() => setIsEditorOpen(false)}
                  />
                </SheetContent>
              </Sheet>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <div key={note.id} onClick={() => handleEditNote(note)}>
                <NoteCard
                  note={note}
                  onEdit={handleEditNote}
                  onDelete={handleDeleteNote}
                  onShare={handleShareNote}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
