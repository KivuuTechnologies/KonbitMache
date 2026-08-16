import type { User } from '@supabase/supabase-js';

export type AuthenticatedUser = User;
export type UserLocale = 'ht' | 'fr' | 'es' | 'en';
export type SellerType = 'farmer' | 'cooperative' | 'company';
export type ProfileStatus = 'incomplete' | 'active' | 'suspended';

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          preferred_language: UserLocale | null;
          seller_type: SellerType | null;
          business_name: string | null;
          department: string | null;
          commune: string | null;
          phone: string | null;
          whatsapp: string | null;
          avatar_url: string | null;
          profile_status: ProfileStatus | null;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          preferred_language?: UserLocale | null;
          seller_type?: SellerType | null;
          business_name?: string | null;
          department?: string | null;
          commune?: string | null;
          phone?: string | null;
          whatsapp?: string | null;
          avatar_url?: string | null;
          profile_status?: ProfileStatus | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string | null;
          preferred_language?: UserLocale | null;
          seller_type?: SellerType | null;
          business_name?: string | null;
          department?: string | null;
          commune?: string | null;
          phone?: string | null;
          whatsapp?: string | null;
          avatar_url?: string | null;
          profile_status?: ProfileStatus | null;
          is_admin?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      product_interactions: {
        Row: {
          id: string;
          product_id: string;
          seller_id: string;
          visitor_id: string;
          interaction_type: 'whatsapp' | 'phone' | 'view';
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          seller_id: string;
          visitor_id: string;
          interaction_type: 'whatsapp' | 'phone' | 'view';
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          seller_id?: string;
          visitor_id?: string;
          interaction_type?: 'whatsapp' | 'phone' | 'view';
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      /**
       * Public aggregated marketplace statistics
       * Created in Supabase as a SECURITY DEFINER function that only returns
       * aggregates (counts), never individual profile rows. Exposes the anon
       * role to read the function, not the profiles table itself
       */
      get_public_marketplace_stats: {
        Args: Record<PropertyKey, never>;
        Returns: {
          farmers: number;
          cooperatives?: number;
          companies?: number;
          departments: Array<{ name: string; count: number }>;
          interested?: number;
        };
      };
      /**
       * Returns the number of unique interested visitors for a product
       */
      get_product_interest_count: {
        Args: { p_product_id: string };
        Returns: number;
      };
      /**
       * Returns the number of unique interested visitors for a seller
       */
      get_seller_interest_count: {
        Args: { p_seller_id: string };
        Returns: number;
      };
      /**
       * Records a product interaction (WhatsApp or Phone click) by a visitor
       */
      record_product_interaction: {
        Args: { p_product_id: string; p_visitor_id: string; p_interaction_type: 'whatsapp' | 'phone' };
        Returns: void;
      };
      /**
       * Returns top sellers ranked by active products count
       * SECURITY DEFINER function that bypasses RLS for public marketplace data
       */
      get_top_sellers: {
        Args: { p_limit: number };
        Returns: Array<{
          id: string;
          full_name: string | null;
          business_name: string | null;
          seller_type: 'farmer' | 'cooperative' | 'company';
          department: string | null;
          commune: string | null;
          avatar_url: string | null;
          phone: string | null;
          whatsapp: string | null;
          created_at: string;
          active_product_count: number;
        }>;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
