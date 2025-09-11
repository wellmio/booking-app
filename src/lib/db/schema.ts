/**
 * Database Schema Types
 *
 * TypeScript types for the Wellmio booking system database.
 * Based on the data model defined in specs/002-improve-wellmio-booking/data-model.md
 * and the Supabase migration in supabase/migrations/0002_add_booking_schema.sql
 */

// Enums matching the database custom types
export type PaymentStatus = 'pending' | 'paid' | 'failed';

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
  is_booked: boolean;
}

export interface Booking {
  id: string; // UUID
  user_id: string; // UUID (Foreign Key to User)
  timeslot_id: string; // UUID (Foreign Key to TimeSlot)
  payment_status: PaymentStatus;
  stripe_session_id: string | null;
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
  timeslot_id: string;
}

export interface BookingResponse {
  id: string;
  time_slot: TimeSlot;
  payment_status: PaymentStatus;
  url: string;
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
  start_time: string;
  end_time: string;
  is_booked?: boolean;
}

export interface BookingInsert {
  user_id: string;
  timeslot_id: string;
  payment_status?: PaymentStatus;
  stripe_session_id?: string | null;
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
  is_booked?: boolean;
}

export interface BookingUpdate {
  payment_status?: PaymentStatus;
  stripe_session_id?: string | null;
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
  TIME_SLOTS: 'timeslots',
  BOOKINGS: 'bookings',
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
