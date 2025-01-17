export interface TeamInviteTable {
  Row: {
    created_at: string
    email: string
    expires_at: string
    id: string
    invited_by: string | null
    token: string
    used_at: string | null
  }
  Insert: {
    created_at?: string
    email: string
    expires_at: string
    id?: string
    invited_by?: string | null
    token: string
    used_at?: string | null
  }
  Update: {
    created_at?: string
    email?: string
    expires_at?: string
    id?: string
    invited_by?: string | null
    token?: string
    used_at?: string | null
  }
  Relationships: [
    {
      foreignKeyName: "team_invites_invited_by_fkey"
      columns: ["invited_by"]
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
  ]
}

export interface TeamMemberTable {
  Row: {
    created_at: string
    id: string
    team_id: string | null
    user_id: string | null
  }
  Insert: {
    created_at?: string
    id?: string
    team_id?: string | null
    user_id?: string | null
  }
  Update: {
    created_at?: string
    id?: string
    team_id?: string | null
    user_id?: string | null
  }
  Relationships: [
    {
      foreignKeyName: "team_members_team_id_fkey"
      columns: ["team_id"]
      referencedRelation: "teams"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "team_members_user_id_fkey"
      columns: ["user_id"]
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
  ]
}

export interface TeamTable {
  Row: {
    created_at: string
    id: string
    name: string
    updated_at: string
  }
  Insert: {
    created_at?: string
    id?: string
    name: string
    updated_at?: string
  }
  Update: {
    created_at?: string
    id?: string
    name?: string
    updated_at?: string
  }
  Relationships: []
}