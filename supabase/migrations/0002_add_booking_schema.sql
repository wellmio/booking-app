-- Create timeslots table
CREATE TABLE timeslots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    is_booked BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create bookings table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    timeslot_id UUID REFERENCES timeslots(id),
    payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed')),
    stripe_session_id TEXT
);

-- Create indexes for better performance
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_timeslot_id ON bookings(timeslot_id);
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX idx_timeslots_start_time ON timeslots(start_time);
CREATE INDEX idx_timeslots_is_booked ON timeslots(is_booked);

-- Enable Row Level Security (RLS)
ALTER TABLE timeslots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for timeslots
CREATE POLICY "Anyone can read timeslots" ON timeslots
    FOR SELECT USING (true);

CREATE POLICY "Only admins can modify timeslots" ON timeslots
    FOR ALL USING (auth.uid() IN (
        SELECT user_id FROM public.admins
    ));

-- RLS Policies for bookings  
CREATE POLICY "Users can read own bookings" ON bookings
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create bookings" ON bookings
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can read all bookings" ON bookings
    FOR SELECT USING (auth.uid() IN (
        SELECT user_id FROM public.admins
    ));

CREATE POLICY "System can update bookings" ON bookings
    FOR UPDATE USING (true);
