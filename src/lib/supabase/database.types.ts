export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      team_members: {
        Row: {
          id: string
          name: string
          role: string
          description: string | null
          image_url: string | null
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          role: string
          description?: string | null
          image_url?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: string
          description?: string | null
          image_url?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_member_links: {
        Row: {
          id: string
          team_member_id: string
          platform: string
          url: string
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          team_member_id: string
          platform: string
          url: string
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          team_member_id?: string
          platform?: string
          url?: string
          sort_order?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_member_links_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          }
        ]
      }
      payment_requests: {
        Row: {
          admin_note: string | null
          created_at: string
          id: string
          receipt_path: string
          reviewed_at: string | null
          reviewed_by: string | null
          startup_id: string
          status: string
        }
        Insert: {
          admin_note?: string | null
          created_at?: string
          id?: string
          receipt_path: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          startup_id: string
          status?: string
        }
        Update: {
          admin_note?: string | null
          created_at?: string
          id?: string
          receipt_path?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          startup_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_requests_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_requests_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
          major: string
          role: string
          university: string
          updated_at: string
          whatsapp: string
        }
        Insert: {
          created_at?: string
          full_name?: string
          id: string
          major?: string
          role?: string
          university?: string
          updated_at?: string
          whatsapp?: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          major?: string
          role?: string
          university?: string
          updated_at?: string
          whatsapp?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      startup_answers: {
        Row: {
          answer: string
          created_at: string
          id: string
          startup_id: string
          updated_at: string
          weapon_number: number
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          startup_id: string
          updated_at?: string
          weapon_number: number
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          startup_id?: string
          updated_at?: string
          weapon_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "startup_answers_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "startup_answers_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "startup_answers_weapon_number_fkey"
            columns: ["weapon_number"]
            isOneToOne: false
            referencedRelation: "weapons"
            referencedColumns: ["number"]
          },
        ]
      }
      startups: {
        Row: {
          created_at: string
          current_step: number
          id: string
          is_premium: boolean
          owner_id: string
          progress_percentage: number
          project_title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_step?: number
          id?: string
          is_premium?: boolean
          owner_id: string
          progress_percentage?: number
          project_title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_step?: number
          id?: string
          is_premium?: boolean
          owner_id?: string
          progress_percentage?: number
          project_title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "startups_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          admin_reply: string | null
          created_at: string
          id: string
          message: string
          name: string
          replied_at: string | null
          status: string
          ticket_type: string
          user_id: string | null
          whatsapp: string | null
        }
        Insert: {
          admin_reply?: string | null
          created_at?: string
          id?: string
          message: string
          name: string
          replied_at?: string | null
          status?: string
          ticket_type?: string
          user_id?: string | null
          whatsapp?: string | null
        }
        Update: {
          admin_reply?: string | null
          created_at?: string
          id?: string
          message?: string
          name?: string
          replied_at?: string | null
          status?: string
          ticket_type?: string
          user_id?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      weapons: {
        Row: {
          knowledge: string
          number: number
          placeholder: string
          summary: string
          task_prompt: string
          title: string
          updated_at: string
        }
        Insert: {
          knowledge: string
          number: number
          placeholder: string
          summary: string
          task_prompt: string
          title: string
          updated_at?: string
        }
        Update: {
          knowledge?: string
          number?: number
          placeholder?: string
          summary?: string
          task_prompt?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      leaderboard: {
        Row: {
          current_step: number | null
          full_name: string | null
          id: string | null
          is_premium: boolean | null
          progress_percentage: number | null
          project_title: string | null
          university: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean }
      review_payment_request: {
        Args: { p_approve: boolean; p_note?: string; p_request_id: string }
        Returns: {
          admin_note: string | null
          created_at: string
          id: string
          receipt_path: string
          reviewed_at: string | null
          reviewed_by: string | null
          startup_id: string
          status: string
        }
      }
      submit_weapon_answer: {
        Args: { p_answer: string; p_weapon_number: number }
        Returns: {
          created_at: string
          current_step: number
          id: string
          is_premium: boolean
          owner_id: string
          progress_percentage: number
          project_title: string
          updated_at: string
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database["public"]

export type Tables<T extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])> =
  (DefaultSchema["Tables"] & DefaultSchema["Views"])[T] extends { Row: infer R } ? R : never

export type TablesInsert<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T] extends { Insert: infer I } ? I : never

export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T] extends { Update: infer U } ? U : never
