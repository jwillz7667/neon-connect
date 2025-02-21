import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type VerificationRequest = Database['public']['Tables']['verification_requests']['Row'];
type VerificationResponse = VerificationRequest[] | null;

interface VerificationStatus {
  status: VerificationRequest['status'] | null;
  submitted_at: string | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>({
    status: null,
    submitted_at: null
  });

  useEffect(() => {
    checkVerificationStatus();
  }, []);

  const checkVerificationStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      // Get the latest verification request
      const { data, error } = await supabase
        .from('verification_requests')
        .select('status, submitted_at')
        .eq('user_id', user.id as Database['public']['Tables']['verification_requests']['Row']['user_id'])
        .order('submitted_at', { ascending: false })
        .limit(1)
        .single() as { 
          data: Pick<VerificationRequest, 'status' | 'submitted_at'> | null; 
          error: any; 
        };

      if (error) {
        console.error('Error fetching verification status:', error);
        return;
      }

      if (data) {
        setVerificationStatus({
          status: data.status,
          submitted_at: data.submitted_at
        });
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold neon-text">Dashboard</h1>

        <Card className="p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="space-y-4">
            {verificationStatus.status === 'pending' && (
              <>
                <h2 className="text-2xl font-semibold text-primary">Verification In Progress</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                    <p className="text-lg">Your verification is being reviewed</p>
                  </div>
                  <p className="text-gray-400">
                    Thank you for submitting your verification documents. Our team is carefully reviewing your information.
                    This process typically takes 24-48 hours to complete. You will receive an email notification once the review is complete.
                  </p>
                  <p className="text-sm text-gray-500">
                    Submitted: {new Date(verificationStatus.submitted_at!).toLocaleDateString()} at{' '}
                    {new Date(verificationStatus.submitted_at!).toLocaleTimeString()}
                  </p>
                </div>
              </>
            )}

            {verificationStatus.status === 'approved' && (
              <>
                <h2 className="text-2xl font-semibold text-green-500">Verification Approved</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <p className="text-lg">Your account has been verified</p>
                  </div>
                  <p className="text-gray-400">
                    Congratulations! Your verification has been approved. You now have full access to all provider features.
                  </p>
                  <Button onClick={() => navigate('/profile/edit')} className="w-full">
                    Complete Your Profile
                  </Button>
                </div>
              </>
            )}

            {verificationStatus.status === 'rejected' && (
              <>
                <h2 className="text-2xl font-semibold text-red-500">Verification Rejected</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <p className="text-lg">Your verification was not approved</p>
                  </div>
                  <p className="text-gray-400">
                    Unfortunately, your verification was not approved. Please review our requirements and submit a new verification request after the waiting period.
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={() => navigate('/help')} 
                    className="w-full"
                  >
                    View Requirements
                  </Button>
                </div>
              </>
            )}

            {!verificationStatus.status && (
              <>
                <h2 className="text-2xl font-semibold">Welcome to Your Dashboard</h2>
                <p className="text-gray-400">
                  To become a verified provider, please complete the verification process.
                </p>
                <Button onClick={() => navigate('/provider-onboarding')} className="w-full">
                  Start Verification
                </Button>
              </>
            )}
          </div>
        </Card>

        <Card className="p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
          <p className="text-gray-400 mb-4">
            If you have any questions about the verification process or need assistance, our support team is here to help.
          </p>
          <Button variant="outline" onClick={() => navigate('/contact')} className="w-full">
            Contact Support
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard; 