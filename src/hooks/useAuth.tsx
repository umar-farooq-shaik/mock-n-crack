import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  tokens: number;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateTokens: (change: number) => Promise<void>;
  refreshTokens: () => Promise<void>;
  setTokensDirect: (value: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [tokens, setTokens] = useState(0); // Default to 0 until fetched from DB
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUserTokens = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('token_balance')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        // Silent error handling - no console logging
        return;
      }

      if (data) {
        setTokens(data.token_balance);
      }
    } catch (error) {
      // Silent error handling - no console logging
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        toast({
          title: "Sign In Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Sign In Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Sign Out Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setUser(null);
        setSession(null);
        setTokens(0);
        toast({
          title: "Signed Out",
          description: "You have been successfully signed out.",
        });
      }
    } catch (error) {
      toast({
        title: "Sign Out Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTokens = async (change: number) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const { data, error } = await supabase.rpc('update_user_tokens', {
        user_uuid: user.id,
        token_change: change,
      });

      if (error) {
        console.error("Token update RPC error:", error);
        toast({
          title: "Token Update Error",
          description: error.message || "Failed to update tokens. Please try again.",
          variant: "destructive",
        });
        throw error;
      }

      setTokens(data);
    } catch (error) {
      console.error("Token update error:", error);
      toast({
        title: "Token Update Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const refreshTokens = async () => {
    if (user) {
      await fetchUserTokens(user.id);
    }
  };

  const setTokensDirect = (value: number) => {
    setTokens(value);
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer token fetching to prevent potential deadlocks
          setTimeout(() => {
            fetchUserTokens(session.user.id);
          }, 0);
        } else {
          setTokens(0); // Reset to 0 when not authenticated
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          fetchUserTokens(session.user.id);
        }, 0);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    session,
    tokens,
    loading,
    signInWithGoogle,
    signOut,
    updateTokens,
    refreshTokens,
    setTokensDirect,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};