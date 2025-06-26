
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchNotes = useCallback(async () => {
    if (!user) {
      setNotes([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error: any) {
      console.log('Error fetching notes:', error);
      toast({
        title: "Error fetching notes",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const createNote = async (title: string, content: string = '', tags: string[] = []) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          title,
          content,
          tags,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      await fetchNotes();
      toast({
        title: "Note created",
        description: "Your note has been created successfully"
      });

      return data;
    } catch (error: any) {
      console.log('Error creating note:', error);
      toast({
        title: "Error creating note",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
  };

  const updateNote = async (id: string, updates: Partial<Omit<Note, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchNotes();
      return data;
    } catch (error: any) {
      console.log('Error updating note:', error);
      toast({
        title: "Error updating note",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchNotes();
      toast({
        title: "Note deleted",
        description: "Your note has been deleted successfully"
      });
    } catch (error: any) {
      console.log('Error deleting note:', error);
      toast({
        title: "Error deleting note",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getPublicNote = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', id)
        .eq('is_public', true)
        .single();

      if (error) {
        throw error;
      }
      return data;
    } catch (error: any) {
      console.log('Error fetching public note:', error);
      toast({
        title: "Error fetching note",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
  }, [toast]);

  const fetchPublicNotes = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('is_public', true)
        .order('updated_at', { ascending: false });

      if (error) {
        throw error;
      }
      return data || [];
    } catch (error: any) {
      console.log('Error fetching public notes:', error);
      toast({
        title: "Error fetching public notes",
        description: error.message,
        variant: "destructive"
      });
      return [];
    }
  }, [toast]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return {
    notes,
    loading,
    createNote,
    updateNote,
    deleteNote,
    getPublicNote,
    fetchPublicNotes,
    refetch: fetchNotes
  };
};
