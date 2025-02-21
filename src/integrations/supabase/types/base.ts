import { CommentTable, ProfileTable, SubscriptionTable } from './tables';
import { DirectMessageTable, FollowTable, LikeTable, PostTable } from './social';
import { TeamInviteTable, TeamMemberTable, TeamTable } from './teams';
import { CategoryTable, LocationTable, SafetyReportTable, ProviderServiceTable, ProviderAvailabilityTable, ProviderReviewTable, FeaturedProfileTable } from './categories';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      comments: CommentTable;
      profiles: ProfileTable;
      subscriptions: SubscriptionTable;
      direct_messages: DirectMessageTable;
      follows: FollowTable;
      likes: LikeTable;
      posts: PostTable;
      team_invites: TeamInviteTable;
      team_members: TeamMemberTable;
      teams: TeamTable;
      categories: CategoryTable;
      locations: LocationTable;
      safety_reports: SafetyReportTable;
      provider_services: ProviderServiceTable;
      provider_availability: ProviderAvailabilityTable;
      provider_reviews: ProviderReviewTable;
      featured_profiles: FeaturedProfileTable;
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'user' | 'provider' | 'admin'
      verification_status: 'pending' | 'approved' | 'rejected' | 'expired'
      report_status: 'pending' | 'investigating' | 'resolved' | 'dismissed'
      availability_status: 'available' | 'busy' | 'away' | 'offline'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]
