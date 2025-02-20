import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

const UnderReviewPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle2 className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Application Under Review</h1>
          <p className="text-gray-500 mb-6">
            Thank you for signing up! Your account is currently under review. 
            This process typically takes 24-48 hours. We'll notify you via email 
            once your account has been approved.
          </p>
          <div className="space-y-4">
            <p className="text-sm text-gray-400">
              Please check your email for further instructions and verification steps.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/login">
                Return to Login
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UnderReviewPage; 