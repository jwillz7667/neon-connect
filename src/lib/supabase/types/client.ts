import { type SupabaseClient as BaseSupabaseClient, type AuthError, type PostgrestError } from '@supabase/supabase-js';
import type { Database, Tables, TableRow, TableInsert, TableUpdate, DatabaseResponse, AuditFields } from './database';

/**
 * Type definitions for Supabase client operations
 */

// Auth Types
export interface AuthResponse<T = any> {
  data: T;
  error: AuthError | null;
}

export interface AuthSession {
  user: {
    id: string;
    email?: string;
    role?: string;
  };
  access_token: string;
  refresh_token: string;
}

export interface AuthOperations {
  signIn: (email: string, password: string) => Promise<AuthResponse<AuthSession>>;
  signUp: (email: string, password: string) => Promise<AuthResponse<AuthSession>>;
  signOut: () => Promise<AuthResponse<void>>;
  getSession: () => Promise<AuthResponse<AuthSession>>;
}

// Custom error type for storage operations
export interface StorageError {
  name: string;
  message: string;
  statusCode?: number;
}

// Type for the authenticated user's context
export interface AuthContext {
  user: {
    id: string;
    email?: string;
  } | null;
}

// Enhanced operation options with audit fields
export interface OperationOptions {
  userId?: string;  // For audit trail
  skipAudit?: boolean;  // To skip audit fields in special cases
}

// Base operation result type
export interface OperationResult<T> {
  data: T | null;
  error: Error | null;
  metadata?: {
    affected_rows?: number;
    status?: number;
  };
}

// Database Types
export interface QueryOptions {
  filter?: Record<string, any>;
  orderBy?: string;
  limit?: number;
  offset?: number;
}

// Database operation types with audit field handling
export interface DatabaseOperations {
  select: <T extends keyof Database['public']['Tables']>(
    table: T,
    options?: {
      columns?: string;
      filter?: Record<string, unknown>;
      orderBy?: string;
      limit?: number;
      offset?: number;
    }
  ) => Promise<DatabaseResponse<TableRow<T>[]>>;

  insert: <T extends keyof Database['public']['Tables']>(
    table: T,
    data: TableInsert<T>,
    options?: OperationOptions
  ) => Promise<DatabaseResponse<TableRow<T>[]>>;

  update: <T extends keyof Database['public']['Tables']>(
    table: T,
    data: TableUpdate<T>,
    filter: Record<string, unknown>,
    options?: OperationOptions
  ) => Promise<DatabaseResponse<TableRow<T>[]>>;

  delete: <T extends keyof Database['public']['Tables']>(
    table: T,
    filter: Record<string, unknown>,
    options?: OperationOptions
  ) => Promise<DatabaseResponse<TableRow<T>[]>>;
}

// Type for handling JSONB operations
export interface JsonbOperations {
  getJsonbField: <T extends keyof Database['public']['Tables'], K extends keyof TableRow<T>>(
    table: T,
    column: K,
    path: string[]
  ) => Promise<DatabaseResponse<unknown>>;
  
  updateJsonbField: <T extends keyof Database['public']['Tables'], K extends keyof TableRow<T>>(
    table: T,
    column: K,
    path: string[],
    value: unknown,
    options?: OperationOptions
  ) => Promise<DatabaseResponse<TableRow<T>>>;
}

// Enhanced client type with audit and JSONB operations
export type EnhancedSupabaseClient = BaseSupabaseClient & {
  // Database operations with audit trail
  db: DatabaseOperations;
  
  // JSONB specific operations
  jsonb: JsonbOperations;
  
  // Current user context for audit trail
  auth: AuthContext;
};

// Type guard to check if a field is auditable
export const isAuditableField = <T extends keyof Database['public']['Tables']>(
  table: T,
  field: keyof TableRow<T>
): field is keyof AuditFields => {
  const auditFields: (keyof AuditFields)[] = ['created_at', 'updated_at', 'created_by', 'updated_by'];
  return auditFields.includes(field as keyof AuditFields);
};

// Helper to extract audit fields from data
export const extractAuditFields = <T extends keyof Database['public']['Tables']>(
  data: TableRow<T>
): Pick<TableRow<T>, keyof AuditFields> => {
  const auditFields = Object.keys(data).filter(key => 
    isAuditableField(data as any, key as keyof typeof data)
  );
  
  return auditFields.reduce((acc, field) => ({
    ...acc,
    [field]: data[field as keyof typeof data]
  }), {} as Pick<TableRow<T>, keyof AuditFields>);
};

// Helper to add audit fields to data
export const addAuditFields = <T extends keyof Database['public']['Tables']>(
  data: TableInsert<T> | TableUpdate<T>,
  userId: string,
  isNew = false
): TableInsert<T> | TableUpdate<T> => {
  const now = new Date().toISOString();
  
  return {
    ...data,
    ...(isNew ? {
      created_at: now,
      created_by: userId,
    } : {}),
    updated_at: now,
    updated_by: userId,
  };
};

// Storage Types
export interface StorageResponse<T = any> {
  data: T;
  error: StorageError | null;
}

export interface StorageOperations {
  upload: (bucket: string, path: string, file: File) => Promise<StorageResponse>;
  download: (bucket: string, path: string) => Promise<StorageResponse<Blob>>;
  delete: (bucket: string, paths: string[]) => Promise<StorageResponse>;
}

// Realtime Types
export type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE';

export interface RealtimePayload<T = any> {
  eventType: RealtimeEvent;
  new: T;
  old: T | null;
  table: string;
  schema: string;
}

export interface RealtimeOperations {
  subscribe: <T extends keyof Database['public']['Tables']>(
    table: T,
    callback: (payload: RealtimePayload<TableRow<T>>) => void
  ) => {
    unsubscribe: () => void;
  };
}

// Combined Client Type
export interface SupabaseClient {
  auth: AuthOperations;
  db: DatabaseOperations;
  storage: StorageOperations;
  realtime: RealtimeOperations;
}

// Error Types
export type SupabaseErrorType = AuthError | PostgrestError | StorageError;

export interface ErrorDetails {
  code: string;
  message: string;
  details?: unknown;
  hint?: string;
} 