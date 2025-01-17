import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LocationSelector from '../LocationSelector';
import ProfileGrid from './ProfileGrid';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ProfileTabsProps {
  profiles: Profile[];
  isLoading: boolean;
  error: Error | null;
  selectedState: string;
  onStateChange: (state: string) => void;
}

const ProfileTabs = ({ profiles, isLoading, error, selectedState, onStateChange }: ProfileTabsProps) => {
  return (
    <Tabs defaultValue="all" className="mb-8">
      <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
        <TabsTrigger value="all">All Profiles</TabsTrigger>
        <TabsTrigger value="location">By Location</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        <ProfileGrid profiles={profiles} isLoading={isLoading} error={error} />
      </TabsContent>
      
      <TabsContent value="location">
        <LocationSelector
          selectedState={selectedState}
          onStateChange={onStateChange}
        />
        <ProfileGrid profiles={profiles} isLoading={isLoading} error={error} />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;