export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string | null
          phone: string | null
          email_verified: boolean
          phone_verified: boolean
          profile_photo_url: string | null
          marketing_consent_email: boolean
          marketing_consent_whatsapp: boolean
          dietary_restrictions: string[] | null
          allergens: string[] | null
          preferred_table_type: string | null
          customer_tags: string[] | null
          total_visits: number
          total_spent: number
          no_show_count: number
          is_blacklisted: boolean
          blacklist_reason: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['customers']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['customers']['Insert']>
      }
      customer_contacts: {
        Row: {
          id: string
          customer_id: string
          contact_type: string
          contact_value: string
          is_verified: boolean
          is_primary: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['customer_contacts']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['customer_contacts']['Insert']>
      }
      otp_verifications: {
        Row: {
          id: string
          contact_type: string
          contact_value: string
          otp_code: string
          expires_at: string
          attempts: number
          is_used: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['otp_verifications']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['otp_verifications']['Insert']>
      }
      restaurant_tables: {
        Row: {
          id: string
          table_number: string
          floor_level: number
          capacity_min: number
          capacity_max: number
          table_type: string | null
          features: string[] | null
          position_x: number | null
          position_y: number | null
          width: number | null
          height: number | null
          rotation: number
          can_combine_with: string[] | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['restaurant_tables']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['restaurant_tables']['Insert']>
      }
      table_blocks: {
        Row: {
          id: string
          table_id: string
          start_datetime: string
          end_datetime: string
          reason: string | null
          created_by: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['table_blocks']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['table_blocks']['Insert']>
      }
      reservations: {
        Row: {
          id: string
          reservation_number: string
          customer_id: string
          reservation_date: string
          reservation_time: string
          duration_minutes: number
          guests_count: number
          assigned_tables: string[] | null
          occasion: string | null
          special_requests: string | null
          dietary_notes: string | null
          status: string
          source: string
          is_verified: boolean
          verified_at: string | null
          verification_method: string | null
          requires_deposit: boolean
          deposit_amount: number | null
          deposit_status: string | null
          deposit_transaction_id: string | null
          confirmation_sent: boolean
          confirmation_sent_at: string | null
          reminder_sent: boolean
          reminder_sent_at: string | null
          admin_notes: string | null
          cancellation_reason: string | null
          created_at: string
          updated_at: string
          checked_in_at: string | null
          completed_at: string | null
          cancelled_at: string | null
          created_by: string | null
          modified_by: string | null
        }
        Insert: Omit<Database['public']['Tables']['reservations']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['reservations']['Insert']>
      }
      reservation_menu_items: {
        Row: {
          id: string
          reservation_id: string
          menu_item_id: string
          quantity: number
          price_at_time: number
          special_instructions: string | null
          is_prepared: boolean
        }
        Insert: Omit<Database['public']['Tables']['reservation_menu_items']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['reservation_menu_items']['Insert']>
      }
      menu_items: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          category: string
          dietary_tags: string[] | null
          allergens: string[] | null
          image_url: string | null
          preparation_time_minutes: number | null
          availability: string
          is_active: boolean
          sort_order: number
          popularity_score: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['menu_items']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['menu_items']['Insert']>
      }
      gallery_images: {
        Row: {
          id: string
          title: string | null
          image_url: string
          thumbnail_url: string | null
          category: string | null
          is_featured: boolean
          sort_order: number
          file_size: number | null
          width: number | null
          height: number | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['gallery_images']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['gallery_images']['Insert']>
      }
      communication_log: {
        Row: {
          id: string
          reservation_id: string | null
          customer_id: string | null
          message_type: string
          channel: string
          recipient: string
          subject: string | null
          message_content: string
          status: string
          error_message: string | null
          sent_at: string | null
          delivered_at: string | null
          read_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['communication_log']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['communication_log']['Insert']>
      }
      message_templates: {
        Row: {
          id: string
          name: string
          template_type: string
          channel: string
          language: string
          subject: string | null
          content: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['message_templates']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['message_templates']['Insert']>
      }
      restaurant_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['restaurant_settings']['Row'], 'id' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['restaurant_settings']['Insert']>
      }
      floor_plans: {
        Row: {
          id: string
          name: string
          background_image_url: string | null
          floor_count: number
          is_active: boolean
          layout_data: Json | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['floor_plans']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['floor_plans']['Insert']>
      }
      admin_users: {
        Row: {
          user_id: string
          role: string
          permissions: Json | null
          is_active: boolean
          last_login: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['admin_users']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['admin_users']['Insert']>
      }
      audit_log: {
        Row: {
          id: string
          admin_user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          changes: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['audit_log']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['audit_log']['Insert']>
      }
      waitlist: {
        Row: {
          id: string
          customer_id: string
          party_size: number
          requested_time: string
          estimated_wait_minutes: number | null
          status: string
          notes: string | null
          created_at: string
          notified_at: string | null
          seated_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['waitlist']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['waitlist']['Insert']>
      }
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
  }
}
