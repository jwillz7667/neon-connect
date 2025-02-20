import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthChange = async () => {
      try {
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          console.log('Auth event:', event);
          console.log('Session:', session);

          if (event === 'SIGNED_IN' && session) {
            // Check if the user was trying to access a specific page
            const redirectTo = localStorage.getItem('redirectAfterAuth');
            if (redirectTo) {
              localStorage.removeItem('redirectAfterAuth');
              navigate(redirectTo);
            } else {
              navigate('/');
            }
          } else if (event === 'SIGNED_OUT') {
            navigate('/login');
          }
        });

        // Initial session check
        if (session) {
          navigate('/');
        }

        // Cleanup subscription
        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred during authentication');
      }
    };

    handleAuthChange();
  }, [navigate]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-500">Authentication Error</h1>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="text-primary hover:underline"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Completing Authentication...</h1>
        <div className="flex justify-center mb-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <p className="text-gray-500">Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
};

export default AuthCallback; 