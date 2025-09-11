-- Enable necessary extensions
-- Note: gen_random_uuid() is available by default in modern PostgreSQL

-- Create custom types
CREATE TYPE payment_status AS ENUM ('pending', 'succeeded', 'failed');
CREATE TYPE slot_status AS ENUM ('available', 'booked');

-- Create users table (extends auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: timeslots and bookings tables are created in 0002_add_booking_schema.sql
-- This migration focuses on users, admins, and booking_options tables

-- Create admins table (references auth.users)
CREATE TABLE public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create booking_options table
CREATE TABLE public.booking_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_admins_user_id ON public.admins(user_id);
-- Note: indexes for timeslots and bookings are created in 0002_add_booking_schema.sql

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_options ENABLE ROW LEVEL SECURITY;
-- Note: RLS for timeslots and bookings is handled in 0002_add_booking_schema.sql

-- Create RLS policies

-- Users can read their own data
CREATE POLICY "Users can read own data" ON public.users
    FOR SELECT USING (auth.uid()::text = id::text);

-- Users can insert their own data
CREATE POLICY "Users can insert own data" ON public.users
    FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- Note: RLS policies for timeslots and bookings are in 0002_add_booking_schema.sql

-- Only admins can access admin table
CREATE POLICY "Admins can access admin table" ON public.admins
    FOR ALL USING (auth.uid() = user_id);

-- Anyone can read booking options
CREATE POLICY "Anyone can read booking options" ON public.booking_options
    FOR SELECT USING (true);

-- Only admins can modify booking options
CREATE POLICY "Admins can modify booking options" ON public.booking_options
    FOR ALL USING (auth.uid() IN (
        SELECT user_id FROM public.admins
    ));

-- Insert default booking options
INSERT INTO public.booking_options (name, value) VALUES
    ('price', '150'),
    ('duration_minutes', '30'),
    ('currency', 'SEK'),
    ('timezone', 'Europe/Stockholm');
