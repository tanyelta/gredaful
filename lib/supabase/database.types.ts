export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      couples: {
        Row: {
          id: string;
          name: string;
          invite_code: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          invite_code?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          invite_code?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          couple_id: string | null;
          display_name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          couple_id?: string | null;
          display_name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          couple_id?: string | null;
          display_name?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_couple_id_fkey";
            columns: ["couple_id"];
            isOneToOne: false;
            referencedRelation: "couples";
            referencedColumns: ["id"];
          },
        ];
      };
      daily_entries: {
        Row: {
          id: string;
          couple_id: string;
          user_id: string;
          entry_date: string;
          highlight: string;
          blessing: string;
          is_favorite: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          couple_id: string;
          user_id: string;
          entry_date: string;
          highlight: string;
          blessing: string;
          is_favorite?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          couple_id?: string;
          user_id?: string;
          entry_date?: string;
          highlight?: string;
          blessing?: string;
          is_favorite?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "daily_entries_couple_id_fkey";
            columns: ["couple_id"];
            isOneToOne: false;
            referencedRelation: "couples";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "daily_entries_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_couple_for_current_user: {
        Args: {
          couple_name: string;
          profile_name: string;
          code: string;
        };
        Returns: string;
      };
      join_couple_by_code: {
        Args: {
          code: string;
          profile_name: string;
        };
        Returns: string;
      };
      ensure_gredaful_profile: {
        Args: {
          profile_name: string;
        };
        Returns: string;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
