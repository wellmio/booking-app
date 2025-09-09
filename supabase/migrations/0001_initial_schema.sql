-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE payment_status AS ENUM ('pending', 'succeeded', 'failed');
CREATE TYPE slot_status AS ENUM ('available', 'booked');

-- Create users table (extends auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create time_slots table
CREATE TABLE public.time_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status slot_status NOT NULL DEFAULT 'available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    time_slot_id UUID NOT NULL REFERENCES public.time_slots(id) ON DELETE CASCADE,
    payment_status payment_status NOT NULL DEFAULT 'pending',
    stripe_payment_intent_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admins table (references auth.users)
CREATE TABLE public.admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create booking_options table
CREATE TABLE public.booking_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_appointments_user_id ON public.appointments(user_id);
CREATE INDEX idx_appointments_time_slot_id ON public.appointments(time_slot_id);
CREATE INDEX idx_appointments_payment_status ON public.appointments(payment_status);
CREATE INDEX idx_time_slots_start_time ON public.time_slots(start_time);
CREATE INDEX idx_time_slots_status ON public.time_slots(status);
CREATE INDEX idx_admins_user_id ON public.admins(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_options ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users can read their own data
CREATE POLICY "Users can read own data" ON public.users
    FOR SELECT USING (auth.uid()::text = id::text);

-- Users can insert their own data
CREATE POLICY "Users can insert own data" ON public.users
    FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- Users can read their own appointments
CREATE POLICY "Users can read own appointments" ON public.appointments
    FOR SELECT USING (user_id IN (
        SELECT id FROM public.users WHERE auth.uid()::text = id::text
    ));

-- Users can create appointments for themselves
CREATE POLICY "Users can create own appointments" ON public.appointments
    FOR INSERT WITH CHECK (user_id IN (
        SELECT id FROM public.users WHERE auth.uid()::text = id::text
    ));

-- Anyone can read available time slots
CREATE POLICY "Anyone can read time slots" ON public.time_slots
    FOR SELECT USING (true);

-- Only admins can modify time slots
CREATE POLICY "Admins can modify time slots" ON public.time_slots
    FOR ALL USING (auth.uid() IN (
        SELECT user_id FROM public.admins
    ));

-- Only admins can read all appointments
CREATE POLICY "Admins can read all appointments" ON public.appointments
    FOR SELECT USING (auth.uid() IN (
        SELECT user_id FROM public.admins
    ));

-- Only admins can modify appointments
CREATE POLICY "Admins can modify appointments" ON public.appointments
    FOR ALL USING (auth.uid() IN (
        SELECT user_id FROM public.admins
    ));

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
