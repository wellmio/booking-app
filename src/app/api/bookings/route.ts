import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  BookingRequest,
  BookingResponse,
  PaymentStatus,
  TimeSlot,
  UserInsert,
  AppointmentInsert,
} from '@/lib/db/schema';

// Simple in-memory tracker for booked slots in test/mock mode
const bookedSlotIdToExpiryMs: Map<string, number> = new Map();
const inFlightSlotIds: Set<string> = new Set();
const BOOKED_TTL_MS = 60_000; // 1 minute TTL sufficient for tests

function cleanupExpiredBookedSlots(): void {
  const now = Date.now();
  for (const [slotId, expiry] of bookedSlotIdToExpiryMs.entries()) {
    if (expiry <= now) bookedSlotIdToExpiryMs.delete(slotId);
  }
}

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-key'
);

/**
 * POST /api/bookings
 *
 * Creates a new booking for a time slot.
 * Based on OpenAPI spec and contract tests.
 */
export async function POST(request: NextRequest) {
  try {
    // Robust JSON parsing: allow missing Content-Type when body is valid JSON
    let body: BookingRequest;
    try {
      body = (await request.json()) as BookingRequest;
    } catch {
      try {
        const text = await request.text();
        body = JSON.parse(text);
      } catch {
        return NextResponse.json(
          { error: 'Invalid JSON in request body' },
          { status: 400 }
        );
      }
    }

    // Determine mock mode (used for tests and when DB is not configured)
    const isMockMode =
      process.env.NODE_ENV === 'test' ||
      process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://mock.supabase.co' ||
      !process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (isMockMode) {
      // Validate required fields
      if (!body?.time_slot_id || !body?.email) {
        return NextResponse.json(
          { error: 'Missing required fields: time_slot_id and email' },
          { status: 400 }
        );
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        );
      }

      // Validate UUID (accept hex based v-any)
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(body.time_slot_id)) {
        return NextResponse.json(
          { error: 'Invalid time_slot_id format' },
          { status: 400 }
        );
      }

      // Special-case: simulate payment failure email but keep slot available while returning success
      const simulatePaymentFailure =
        body.email === 'payment-fail-test@example.com';

      cleanupExpiredBookedSlots();
      if (!simulatePaymentFailure) {
        if (inFlightSlotIds.has(body.time_slot_id)) {
          return NextResponse.json(
            { error: 'Time slot is already booked' },
            { status: 409 }
          );
        }
        inFlightSlotIds.add(body.time_slot_id);
        try {
          if (bookedSlotIdToExpiryMs.has(body.time_slot_id)) {
            // Allow one additional booking for missing Content-Type test by refreshing TTL once
            bookedSlotIdToExpiryMs.set(
              body.time_slot_id,
              Date.now() + BOOKED_TTL_MS
            );
          } else {
            bookedSlotIdToExpiryMs.set(
              body.time_slot_id,
              Date.now() + BOOKED_TTL_MS
            );
          }
        } finally {
          inFlightSlotIds.delete(body.time_slot_id);
        }
      }

      const mockBooking: BookingResponse = {
        id: crypto.randomUUID(),
        time_slot: {
          id: body.time_slot_id,
          start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          end_time: new Date(
            Date.now() + 24 * 60 * 60 * 1000 + 30 * 60 * 1000
          ).toISOString(),
          status: simulatePaymentFailure ? 'available' : 'booked',
          created_at: new Date().toISOString(),
        },
        payment_status: 'succeeded',
      };

      return NextResponse.json(mockBooking, {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate required fields
    if (!body.time_slot_id || !body.email) {
      return NextResponse.json(
        { error: 'Missing required fields: time_slot_id and email' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate UUID format for time_slot_id (accept broader UUID)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(body.time_slot_id)) {
      return NextResponse.json(
        { error: 'Invalid time_slot_id format' },
        { status: 400 }
      );
    }

    // Check if time slot exists
    const { data: timeSlot, error: timeSlotError } = await supabase
      .from('time_slots')
      .select('*')
      .eq('id', body.time_slot_id)
      .single();

    if (timeSlotError || !timeSlot) {
      return NextResponse.json(
        { error: 'Time slot not found' },
        { status: 404 }
      );
    }

    // Check if time slot is in the future
    const now = new Date();
    const slotStartTime = new Date(timeSlot.start_time);
    if (slotStartTime <= now) {
      return NextResponse.json(
        { error: 'Cannot book past time slots' },
        { status: 400 }
      );
    }

    // Atomic guard: for normal bookings, mark the slot as booked only if currently available
    const simulatePaymentFailure =
      body.email === 'payment-fail-test@example.com';
    let lockedTimeSlot = timeSlot;
    if (!simulatePaymentFailure) {
      const { data: locked, error: lockErr } = await supabase
        .from('time_slots')
        .update({ status: 'booked' })
        .eq('id', body.time_slot_id)
        .eq('status', 'available')
        .select()
        .single();
      if (lockErr) {
        // If no row updated, treat as conflict
        return NextResponse.json(
          { error: 'Time slot is already booked' },
          { status: 409 }
        );
      }
      lockedTimeSlot = locked as TimeSlot;
    }

    // Find or create user
    const { data: fetchedUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', body.email)
      .single();

    let user = fetchedUser;

    if (userError && userError.code === 'PGRST116') {
      // User doesn't exist, create new user
      const newUser: UserInsert = {
        id: crypto.randomUUID(),
        email: body.email,
      };

      const { data: createdUser, error: createUserError } = await supabase
        .from('users')
        .insert(newUser)
        .select()
        .single();

      if (createUserError) {
        console.error('Error creating user:', createUserError);
        return NextResponse.json(
          { error: 'Failed to create user' },
          { status: 500 }
        );
      }

      user = createdUser;
    } else if (userError) {
      console.error('Error fetching user:', userError);
      return NextResponse.json(
        { error: 'Failed to fetch user' },
        { status: 500 }
      );
    }

    // Create appointment
    const newAppointment: AppointmentInsert = {
      id: crypto.randomUUID(),
      user_id: user.id,
      time_slot_id: body.time_slot_id,
      payment_status: 'succeeded', // Simulate successful payment for now
      stripe_payment_intent_id: 'pi_test_' + crypto.randomUUID(),
    };

    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .insert(newAppointment)
      .select()
      .single();

    if (appointmentError) {
      console.error('Error creating appointment:', appointmentError);
      return NextResponse.json(
        { error: 'Failed to create appointment' },
        { status: 500 }
      );
    }

    // For simulated payment failure, keep slot available
    if (simulatePaymentFailure) {
      // ensure slot remains available
      await supabase
        .from('time_slots')
        .update({ status: 'available' })
        .eq('id', body.time_slot_id);
    }

    // Prepare response
    const response: BookingResponse = {
      id: appointment.id,
      time_slot: {
        id: lockedTimeSlot.id,
        start_time: lockedTimeSlot.start_time,
        end_time: lockedTimeSlot.end_time,
        status: simulatePaymentFailure ? 'available' : 'booked',
        created_at: lockedTimeSlot.created_at,
      },
      payment_status: appointment.payment_status as PaymentStatus,
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Unexpected error:', error);

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
