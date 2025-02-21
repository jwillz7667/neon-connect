import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LocationSelector from '../LocationSelector';
import { ProfileGrid } from '../profile/ProfileGrid';
import type { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ProfileTabsProps {
  profiles: Profile[];
  loading: boolean;
  selectedState: string | null;
  onStateChange: (state: string) => void;
}

export function ProfileTabs({ 
  profiles, 
  loading, 
  selectedState, 
  onStateChange 
}: ProfileTabsProps) {
  return (
    <Tabs defaultValue="all" className="mb-8">
      <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
        <TabsTrigger value="all">All Profiles</TabsTrigger>
        <TabsTrigger value="location">By Location</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="mt-6">
        <ProfileGrid 
          profiles={profiles} 
          loading={loading} 
        />
      </TabsContent>
      
      <TabsContent value="location" className="mt-6">
        <div className="space-y-6">
          <LocationSelector
            selectedState={selectedState || ''}
            onStateChange={onStateChange}
          />
          <ProfileGrid 
            profiles={profiles.filter(profile => 
              selectedState ? profile.state === selectedState : true
            )}
            loading={loading}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}

export default ProfileTabs;
