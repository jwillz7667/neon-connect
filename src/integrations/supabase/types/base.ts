import { CommentTable, ProfileTable, SubscriptionTable } from './tables';
import { DirectMessageTable, FollowTable, LikeTable, PostTable } from './social';
import { TeamInviteTable, TeamMemberTable, TeamTable } from './teams';

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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]