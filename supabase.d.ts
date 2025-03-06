import { Database } from './types/supabase'

declare global {
  type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
  type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
  
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SUPABASE_URL: string
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    }
  }
}