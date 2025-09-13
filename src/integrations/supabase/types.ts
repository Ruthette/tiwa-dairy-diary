export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options    
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      animals: {
        Row: {
          breed: string
          created_at: string
          date_of_birth: string
          deleted_at: string | null
          gender: string
          health_status: string | null
          id: string
          name: string
          notes: string | null
          photo_url: string | null
          source: string
          tag: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          breed: string
          created_at?: string
          date_of_birth: string
          deleted_at?: string | null
          gender?: string
          health_status?: string | null
          id?: string
          name: string
          notes?: string | null
          photo_url?: string | null
          source: string
          tag?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          breed?: string
          created_at?: string
          date_of_birth?: string
          deleted_at?: string | null
          gender?: string
          health_status?: string | null
          id?: string
          name?: string
          notes?: string | null
          photo_url?: string | null
          source?: string
          tag?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      breeding_records: {
        Row: {
          actual_calving_date: string | null
          animal_id: string
          bull_ai_source: string | null
          conception_status: string | null
          cost: number | null
          created_at: string
          date_of_heat: string | null
          date_served: string | null
          deleted_at: string | null
          expected_calving_date: string | null
          id: string
          mating_method: string | null
          notes: string
          observation_date: string | null
          pregnancy_confirmation_date: string | null
          steaming_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          actual_calving_date?: string | null
          animal_id: string
          bull_ai_source?: string | null
          conception_status?: string | null
          cost?: number | null
          created_at?: string
          date_of_heat?: string | null
          date_served?: string | null
          deleted_at?: string | null
          expected_calving_date?: string | null
          id?: string
          mating_method?: string | null
          notes: string
          observation_date?: string | null
          pregnancy_confirmation_date?: string | null
          steaming_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          actual_calving_date?: string | null
          animal_id?: string
          bull_ai_source?: string | null
          conception_status?: string | null
          cost?: number | null
          created_at?: string
          date_of_heat?: string | null
          date_served?: string | null
          deleted_at?: string | null
          expected_calving_date?: string | null
          id?: string
          mating_method?: string | null
          notes?: string
          observation_date?: string | null
          pregnancy_confirmation_date?: string | null
          steaming_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "breeding_records_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      feeding_records: {
        Row: {
          animal_id: string
          cost: number | null
          created_at: string
          date: string
          deleted_at: string | null
          feed_type: string
          id: string
          notes: string | null
          quantity: number | null
          source_of_feed: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          animal_id: string
          cost?: number | null
          created_at?: string
          date: string
          deleted_at?: string | null
          feed_type: string
          id?: string
          notes?: string | null
          quantity?: number | null
          source_of_feed?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          animal_id?: string
          cost?: number | null
          created_at?: string
          date?: string
          deleted_at?: string | null
          feed_type?: string
          id?: string
          notes?: string | null
          quantity?: number | null
          source_of_feed?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feeding_records_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_records: {
        Row: {
          amount: number
          animal_id: string | null
          buyer_contact: string | null
          buyer_name: string | null
          category: string
          created_at: string
          description: string | null
          id: string
          photo_url: string | null
          receipt_photo_url: string | null
          supplier_contact: string | null
          supplier_name: string | null
          transaction_date: string
          transaction_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          animal_id?: string | null
          buyer_contact?: string | null
          buyer_name?: string | null
          category: string
          created_at?: string
          description?: string | null
          id?: string
          photo_url?: string | null
          receipt_photo_url?: string | null
          supplier_contact?: string | null
          supplier_name?: string | null
          transaction_date: string
          transaction_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          animal_id?: string | null
          buyer_contact?: string | null
          buyer_name?: string | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          photo_url?: string | null
          receipt_photo_url?: string | null
          supplier_contact?: string | null
          supplier_name?: string | null
          transaction_date?: string
          transaction_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_records_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      health_records: {
        Row: {
          animal_id: string
          cost: number | null
          created_at: string
          date: string
          deleted_at: string | null
          health_issue: string | null
          id: string
          next_appointment: string | null
          notes: string | null
          recovery_status: string | null
          treatment_given: string | null
          updated_at: string
          user_id: string
          vaccine_dewormer: string | null
          vet_name: string | null
        }
        Insert: {
          animal_id: string
          cost?: number | null
          created_at?: string
          date: string
          deleted_at?: string | null
          health_issue?: string | null
          id?: string
          next_appointment?: string | null
          notes?: string | null
          recovery_status?: string | null
          treatment_given?: string | null
          updated_at?: string
          user_id: string
          vaccine_dewormer?: string | null
          vet_name?: string | null
        }
        Update: {
          animal_id?: string
          cost?: number | null
          created_at?: string
          date?: string
          deleted_at?: string | null
          health_issue?: string | null
          id?: string
          next_appointment?: string | null
          notes?: string | null
          recovery_status?: string | null
          treatment_given?: string | null
          updated_at?: string
          user_id?: string
          vaccine_dewormer?: string | null
          vet_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "health_records_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          category: string
          cost: number | null
          created_at: string
          id: string
          item_name: string
          notes: string | null
          quantity: number
          reorder_level: number | null
          supplier_contact: string | null
          supplier_name: string | null
          unit: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          cost?: number | null
          created_at?: string
          id?: string
          item_name: string
          notes?: string | null
          quantity?: number
          reorder_level?: number | null
          supplier_contact?: string | null
          supplier_name?: string | null
          unit: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          cost?: number | null
          created_at?: string
          id?: string
          item_name?: string
          notes?: string | null
          quantity?: number
          reorder_level?: number | null
          supplier_contact?: string | null
          supplier_name?: string | null
          unit?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      production_records: {
        Row: {
          am_yield: number | null
          animal_id: string
          created_at: string
          date: string
          deleted_at: string | null
          id: string
          noon_yield: number | null
          notes: string | null
          pm_yield: number | null
          price_per_litre: number | null
          total_yield: number | null
          updated_at: string
          use_type: string | null
          user_id: string
        }
        Insert: {
          am_yield?: number | null
          animal_id: string
          created_at?: string
          date: string
          deleted_at?: string | null
          id?: string
          noon_yield?: number | null
          notes?: string | null
          pm_yield?: number | null
          price_per_litre?: number | null
          total_yield?: number | null
          updated_at?: string
          use_type?: string | null
          user_id: string
        }
        Update: {
          am_yield?: number | null
          animal_id?: string
          created_at?: string
          date?: string
          deleted_at?: string | null
          id?: string
          noon_yield?: number | null
          notes?: string | null
          pm_yield?: number | null
          price_per_litre?: number | null
          total_yield?: number | null
          updated_at?: string
          use_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "production_records_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          farm_name: string | null
          id: string
          phone: string | null
          updated_at: string
          zone: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          farm_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
          zone?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          farm_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          zone?: string | null
        }
        Relationships: []
      }
      reminders: {
        Row: {
          animal_id: string | null
          created_at: string
          description: string | null
          due_date: string
          id: string
          is_recurring: boolean | null
          recurring_interval: number | null
          reminder_type: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          animal_id?: string | null
          created_at?: string
          description?: string | null
          due_date: string
          id?: string
          is_recurring?: boolean | null
          recurring_interval?: number | null
          reminder_type: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          animal_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string
          id?: string
          is_recurring?: boolean | null
          recurring_interval?: number | null
          reminder_type?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          animal_id: string | null
          assigned_to: string | null
          created_at: string
          description: string | null
          due_date: string
          due_time: string | null
          id: string
          photo_url: string | null
          priority: string
          reminder_date: string | null
          reminder_enabled: boolean | null
          reminder_time: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          animal_id?: string | null
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          due_date: string
          due_time?: string | null
          id?: string
          photo_url?: string | null
          priority?: string
          reminder_date?: string | null
          reminder_enabled?: boolean | null
          reminder_time?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          animal_id?: string | null
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          due_date?: string
          due_time?: string | null
          id?: string
          photo_url?: string | null
          priority?: string
          reminder_date?: string | null
          reminder_enabled?: boolean | null
          reminder_time?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_by: string | null
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_effective_owner: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_effective_owner_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      user_role: "worker" | "owner"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["worker", "owner"],
    },
  },
} as const