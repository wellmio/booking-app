/**
 * Database Schema Types
 *
 * TypeScript types for the Wellmio booking system database.
 * Based on the data model defined in specs/001-build-a-web/data-model.md
 * and the Supabase migration in supabase/migrations/0001_initial_schema.sql
 */

// Enums matching the database custom types
export type PaymentStatus = 'pending' | 'succeeded' | 'failed';
export type SlotStatus = 'available' | 'booked';

// Database table types
export interface User {
  id: string; // UUID
  email: string;
  created_at: string; // ISO timestamp
}

export interface TimeSlot {
  id: string; // UUID
  start_time: string; // ISO timestamp
  end_time: string; // ISO timestamp
  status: SlotStatus;
  created_at: string; // ISO timestamp
}

export interface Appointment {
  id: string; // UUID
  user_id: string; // UUID (Foreign Key to User)
  time_slot_id: string; // UUID (Foreign Key to TimeSlot)
  payment_status: PaymentStatus;
  stripe_payment_intent_id: string | null;
  created_at: string; // ISO timestamp
}

export interface Admin {
  id: string; // UUID
  user_id: string; // UUID (Foreign Key to auth.users)
  created_at: string; // ISO timestamp
}

export interface BookingOption {
  id: string; // UUID
  name: string;
  value: string;
  created_at: string; // ISO timestamp
}

// API Request/Response types
export interface BookingRequest {
  time_slot_id: string;
  email: string;
}

export interface BookingResponse {
  id: string;
  time_slot: TimeSlot;
  payment_status: PaymentStatus;
}

export interface BookingOptionRequest {
  id: string;
  name: string;
  value: string;
}

// Database insert types (without auto-generated fields)
export interface UserInsert {
  id: string;
  email: string;
}

export interface TimeSlotInsert {
  id: string;
  start_time: string;
  end_time: string;
  status?: SlotStatus;
}

export interface AppointmentInsert {
  id: string;
  user_id: string;
  time_slot_id: string;
  payment_status?: PaymentStatus;
  stripe_payment_intent_id?: string | null;
}

export interface AdminInsert {
  id: string;
  user_id: string;
}

export interface BookingOptionInsert {
  id: string;
  name: string;
  value: string;
}

// Database update types (partial updates)
export interface UserUpdate {
  email?: string;
}

export interface TimeSlotUpdate {
  start_time?: string;
  end_time?: string;
  status?: SlotStatus;
}

export interface AppointmentUpdate {
  payment_status?: PaymentStatus;
  stripe_payment_intent_id?: string | null;
}

export interface BookingOptionUpdate {
  name?: string;
  value?: string;
}

// Utility types for database operations
export interface DatabaseResult<T> {
  data: T | null;
  error: string | null;
}

export interface DatabaseListResult<T> {
  data: T[] | null;
  error: string | null;
}

// Table names for database queries
export const TABLES = {
  USERS: 'users',
  TIME_SLOTS: 'time_slots',
  APPOINTMENTS: 'appointments',
  ADMINS: 'admins',
  BOOKING_OPTIONS: 'booking_options',
} as const;

// Default booking options
export const DEFAULT_BOOKING_OPTIONS = [
  { name: 'price', value: '150' },
  { name: 'duration_minutes', value: '30' },
  { name: 'currency', value: 'SEK' },
  { name: 'timezone', value: 'Europe/Stockholm' },
] as const;
