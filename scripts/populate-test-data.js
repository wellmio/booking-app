#!/usr/bin/env node

/**
 * Script to populate the database with test data for integration tests
 */

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
);

async function populateTestData() {
  console.log('Populating database with test data...');

  try {
    // Create test time slots for the next 7 days
    const timeSlots = [];
    const now = new Date();
    
    for (let day = 1; day <= 7; day++) {
      const date = new Date(now);
      date.setDate(date.getDate() + day);
      
      // Create 3 time slots per day (9 AM, 2 PM, 6 PM)
      const times = [9, 14, 18];
      
      for (const hour of times) {
        const startTime = new Date(date);
        startTime.setHours(hour, 0, 0, 0);
        
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + 30);
        
        timeSlots.push({
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          status: 'available'
        });
      }
    }

    // Insert time slots
    const { data: insertedTimeSlots, error: timeSlotsError } = await supabase
      .from('time_slots')
      .insert(timeSlots)
      .select();

    if (timeSlotsError) {
      console.error('Error inserting time slots:', timeSlotsError);
      return;
    }

    console.log(`✅ Created ${insertedTimeSlots.length} time slots`);

    // Check if booking options already exist
    const { data: existingOptions } = await supabase
      .from('booking_options')
      .select('*');

    if (!existingOptions || existingOptions.length === 0) {
      // Insert default booking options
      const bookingOptions = [
        { name: 'price', value: '150' },
        { name: 'duration_minutes', value: '30' },
        { name: 'currency', value: 'SEK' },
        { name: 'timezone', value: 'Europe/Stockholm' },
        { name: 'max_bookings_per_day', value: '10' },
        { name: 'booking_window_days', value: '30' }
      ];

      const { data: insertedOptions, error: optionsError } = await supabase
        .from('booking_options')
        .insert(bookingOptions)
        .select();

      if (optionsError) {
        console.error('Error inserting booking options:', optionsError);
        return;
      }

      console.log(`✅ Created ${insertedOptions.length} booking options`);
    } else {
      console.log(`✅ Booking options already exist (${existingOptions.length} options)`);
    }

    console.log('🎉 Test data population completed successfully!');
    
  } catch (error) {
    console.error('Error populating test data:', error);
  }
}

// Run the script
populateTestData();
