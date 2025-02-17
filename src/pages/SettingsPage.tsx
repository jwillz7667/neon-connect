
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 neon-text">Settings</h1>

        <div className="space-y-6">
          <div className="glass-card p-6 rounded-lg space-y-6">
            <h2 className="text-xl font-semibold mb-4 neon-text">Account Settings</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Email Notifications</Label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Receive email notifications</span>
                  <Switch />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Profile Privacy</Label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Make profile private</span>
                  <Switch />
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-lg space-y-6">
            <h2 className="text-xl font-semibold mb-4 neon-text">Security</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" />
              </div>

              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" />
              </div>

              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input type="password" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
