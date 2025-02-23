import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { z } from 'zod';
import { GlassCard } from '@/components/ui/glass-card';

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  role: z.enum(['user', 'provider']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<SignupForm>({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate form data
      const validatedData = signupSchema.parse(formData);

      // Sign up with Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          data: {
            role: validatedData.role,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (data?.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              role: validatedData.role,
            },
          ]);

        if (profileError) throw profileError;

        // Redirect based on role
        if (validatedData.role === 'provider') {
          navigate('/provider-onboarding');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 via-transparent to-neon-magenta/5" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      
      <GlassCard 
        variant="auth"
        className="w-full max-w-md p-8 space-y-8"
      >
        <div>
          <h2 className="text-center text-3xl font-bold text-white">Create your account</h2>
          <p className="mt-2 text-center text-sm text-white/70">
            Or{' '}
            <Link to="/login" className="font-medium text-[#FF00FF] hover:text-[#FF00FF]/80 transition-colors">
              sign in to your account
            </Link>
          </p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-500/10 p-4 border border-red-500/20">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-2 bg-black/50 text-white placeholder-white/50 
                border-2 border-[#FF00FF]/30 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF00FF] focus:border-[#FF00FF] 
                sm:text-sm transition-colors"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 bg-black/50 text-white placeholder-white/50 
                border-2 border-[#FF00FF]/30 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF00FF] focus:border-[#FF00FF] 
                sm:text-sm transition-colors"
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 bg-black/50 text-white placeholder-white/50 
                border-2 border-[#FF00FF]/30 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF00FF] focus:border-[#FF00FF] 
                sm:text-sm transition-colors"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Account Type
            </label>
            <div className="flex items-center justify-center space-x-6">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="text-[#FF00FF] focus:ring-[#FF00FF] border-[#FF00FF]/30"
                  name="role"
                  value="user"
                  checked={formData.role === 'user'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'user' | 'provider' })}
                />
                <span className="ml-2 text-white">User</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="text-[#FF00FF] focus:ring-[#FF00FF] border-[#FF00FF]/30"
                  name="role"
                  value="provider"
                  checked={formData.role === 'provider'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'user' | 'provider' })}
                />
                <span className="ml-2 text-white">Provider</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF00FF] text-white py-3 rounded-md border-2 border-[#FF00FF]/30 
            hover:bg-[#FF00FF]/90 hover:border-[#FF00FF] transition-all duration-300 
            focus:outline-none focus:ring-2 focus:ring-[#FF00FF]/50 text-lg font-medium"
          >
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-white/70">
            By signing up, you agree to our{' '}
            <Link to="/terms" className="font-medium text-[#FF00FF] hover:text-[#FF00FF]/80 transition-colors">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="font-medium text-[#FF00FF] hover:text-[#FF00FF]/80 transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
      </GlassCard>
    </div>
  );
}

export default SignupPage;
