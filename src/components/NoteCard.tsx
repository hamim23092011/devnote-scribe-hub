
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, Trash2, Share, MoreVertical, Globe } from 'lucide-react';
import { Note } from '@/hooks/useNotes';
import { formatDistanceToNow } from 'date-fns';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onShare?: (note: Note) => void;
}

export const NoteCard = ({ note, onEdit, onDelete, onShare }: NoteCardProps) => {
  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2 mb-2">
              {note.title}
              {note.is_public && (
                <Globe className="w-4 h-4 inline ml-2 text-green-600" />
              )}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onEdit(note)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              {note.is_public && onShare && (
                <DropdownMenuItem onClick={() => onShare(note)}>
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={() => onDelete(note.id)}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {note.content && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {truncateContent(note.content.replace(/[#*`_]/g, ''))}
            </p>
          )}
          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {note.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {note.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{note.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
