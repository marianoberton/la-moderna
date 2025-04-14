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
      vehicles: {
        Row: {
          id: string
          marca: string
          modelo: string
          version: string
          precio?: number
          año?: number
          kilometraje?: number
          combustible?: string
          transmision?: string
          color?: string
          puertas?: number
          pasajeros?: number
          ubicacion?: string
          imagenes?: string[]
          caracteristicas?: string[]
          equipamiento?: Record<string, boolean>
          selected_highlights?: string[]
          condicion?: string
          descripcion?: string
          tipo?: string
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: string
          marca: string
          modelo: string
          version: string
          precio?: number
          año?: number
          kilometraje?: number
          combustible?: string
          transmision?: string
          color?: string
          puertas?: number
          pasajeros?: number
          ubicacion?: string
          imagenes?: string[]
          caracteristicas?: string[]
          equipamiento?: Record<string, boolean>
          selected_highlights?: string[]
          condicion?: string
          descripcion?: string
          tipo?: string
        }
        Update: {
          id?: string
          marca?: string
          modelo?: string
          version?: string
          precio?: number
          año?: number
          kilometraje?: number
          combustible?: string
          transmision?: string
          color?: string
          puertas?: number
          pasajeros?: number
          ubicacion?: string
          imagenes?: string[]
          caracteristicas?: string[]
          equipamiento?: Record<string, boolean>
          selected_highlights?: string[]
          condicion?: string
          descripcion?: string
          tipo?: string
        }
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