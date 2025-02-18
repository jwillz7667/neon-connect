
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from 'react-router-dom';

const AgeDisclaimer = () => {
  const [open, setOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hasAccepted = localStorage.getItem('ageVerified');
    if (!hasAccepted) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    if (accepted) {
      localStorage.setItem('ageVerified', 'true');
      setOpen(false);
    }
  };

  const handleDecline = () => {
    navigate('/safety');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="glass-card border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Age Verification Required</DialogTitle>
          <DialogDescription className="text-lg pt-4">
            This website contains adult content and is intended for mature audiences only.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6">
          <p className="text-white/80 mb-4">
            By entering this site, you confirm that:
          </p>
          <ul className="list-disc pl-6 text-white/80 space-y-2">
            <li>You are at least 18 years old</li>
            <li>It is legal to view adult content in your location</li>
            <li>You agree to our Terms of Service and Privacy Policy</li>
          </ul>
        </div>

        <div className="flex items-center space-x-2 mb-6">
          <Checkbox 
            id="age-verify" 
            checked={accepted} 
            onCheckedChange={(checked) => setAccepted(checked as boolean)}
            className="border-primary"
          />
          <Label htmlFor="age-verify" className="text-white cursor-pointer">
            I confirm that I am at least 18 years old
          </Label>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-4">
          <Button
            variant="destructive"
            onClick={handleDecline}
            className="sm:flex-1"
          >
            Exit
          </Button>
          <Button
            onClick={handleAccept}
            disabled={!accepted}
            className="sm:flex-1"
          >
            Enter Site
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AgeDisclaimer;
