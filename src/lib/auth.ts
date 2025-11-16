import { supabase } from "@/integrations/supabase/client";

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  roles: string[];
}

export const signUp = async (email: string, password: string, full_name: string) => {
  const redirectUrl = `${window.location.origin}/dashboard`;
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
      data: {
        full_name,
      },
    },
  });

  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();

  const { data: userRoles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id);

  return {
    id: user.id,
    email: user.email || '',
    full_name: profile?.full_name || '',
    roles: userRoles?.map(r => r.role) || [],
  };
};
