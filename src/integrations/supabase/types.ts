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
      background_images: {
        Row: {
          active: boolean | null
          created_at: string
          id: string
          name: string
          url: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          id?: string
          name: string
          url: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          id?: string
          name?: string
          url?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          user_id: string
          venue_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id: string
          venue_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          full_name: string | null
          id: string
          is_anonymous: boolean | null
          username: string | null
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          full_name?: string | null
          id: string
          is_anonymous?: boolean | null
          username?: string | null
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          full_name?: string | null
          id?: string
          is_anonymous?: boolean | null
          username?: string | null
        }
        Relationships: []
      }
      venues: {
        Row: {
          address: string
          city: string
          created_at: string | null
          current_vibe: Database["public"]["Enums"]["vibe_level"] | null
          id: string
          last_updated: string | null
          latitude: number
          longitude: number
          mapbox_id: string | null
          name: string
          source: string | null
          venue_type: string | null
          vote_count: number | null
        }
        Insert: {
          address: string
          city: string
          created_at?: string | null
          current_vibe?: Database["public"]["Enums"]["vibe_level"] | null
          id?: string
          last_updated?: string | null
          latitude: number
          longitude: number
          mapbox_id?: string | null
          name: string
          source?: string | null
          venue_type?: string | null
          vote_count?: number | null
        }
        Update: {
          address?: string
          city?: string
          created_at?: string | null
          current_vibe?: Database["public"]["Enums"]["vibe_level"] | null
          id?: string
          last_updated?: string | null
          latitude?: number
          longitude?: number
          mapbox_id?: string | null
          name?: string
          source?: string | null
          venue_type?: string | null
          vote_count?: number | null
        }
        Relationships: []
      }
      votes: {
        Row: {
          created_at: string | null
          id: string
          user_id: string
          venue_id: string
          vibe: Database["public"]["Enums"]["vibe_level"]
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id: string
          venue_id: string
          vibe: Database["public"]["Enums"]["vibe_level"]
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string
          venue_id?: string
          vibe?: Database["public"]["Enums"]["vibe_level"]
        }
        Relationships: [
          {
            foreignKeyName: "votes_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      vibe_level: "chill" | "decent" | "turnt" | "quiet"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      vibe_level: ["chill", "decent", "turnt", "quiet"],
    },
  },
} as const
