export interface DirectMessageTable {
  Row: {
    content: string
    created_at: string
    id: string
    read_at: string | null
    recipient_id: string | null
    sender_id: string | null
  }
  Insert: {
    content: string
    created_at?: string
    id?: string
    read_at?: string | null
    recipient_id?: string | null
    sender_id?: string | null
  }
  Update: {
    content?: string
    created_at?: string
    id?: string
    read_at?: string | null
    recipient_id?: string | null
    sender_id?: string | null
  }
  Relationships: [
    {
      foreignKeyName: "direct_messages_recipient_id_fkey"
      columns: ["recipient_id"]
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "direct_messages_sender_id_fkey"
      columns: ["sender_id"]
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
  ]
}

export interface FollowTable {
  Row: {
    created_at: string
    follower_id: string | null
    following_id: string | null
    id: string
  }
  Insert: {
    created_at?: string
    follower_id?: string | null
    following_id?: string | null
    id?: string
  }
  Update: {
    created_at?: string
    follower_id?: string | null
    following_id?: string | null
    id?: string
  }
  Relationships: [
    {
      foreignKeyName: "follows_follower_id_fkey"
      columns: ["follower_id"]
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "follows_following_id_fkey"
      columns: ["following_id"]
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
  ]
}

export interface LikeTable {
  Row: {
    created_at: string
    id: string
    post_id: string | null
    user_id: string | null
  }
  Insert: {
    created_at?: string
    id?: string
    post_id?: string | null
    user_id?: string | null
  }
  Update: {
    created_at?: string
    id?: string
    post_id?: string | null
    user_id?: string | null
  }
  Relationships: [
    {
      foreignKeyName: "likes_post_id_fkey"
      columns: ["post_id"]
      referencedRelation: "posts"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "likes_user_id_fkey"
      columns: ["user_id"]
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
  ]
}

export interface PostTable {
  Row: {
    content: string
    created_at: string
    id: string
    media_urls: string[] | null
    updated_at: string
    user_id: string | null
  }
  Insert: {
    content: string
    created_at?: string
    id?: string
    media_urls?: string[] | null
    updated_at?: string
    user_id?: string | null
  }
  Update: {
    content?: string
    created_at?: string
    id?: string
    media_urls?: string[] | null
    updated_at?: string
    user_id?: string | null
  }
  Relationships: [
    {
      foreignKeyName: "posts_user_id_fkey"
      columns: ["user_id"]
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
  ]
}