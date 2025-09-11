import { describe, it, expect, beforeAll, afterAll, jest } from '@jest/globals';

/**
 * Contract Test for POST /api/bookings
 *
 * This test verifies the API contract for creating new bookings.
 * It should FAIL until the endpoint is implemented.
 *
 * Based on OpenAPI spec: /api/bookings POST
 * Expected request: BookingRequest object
 * Expected response: Booking object
 */

describe('POST /api/bookings', () => {
  let baseUrl: string;
  let authToken: string;

  beforeAll(() => {
    baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';
    authToken = process.env.TEST_USER_TOKEN || 'mock-user-token';
  });

  afterAll(() => {
    // Cleanup if needed
  });

  it('should create a new booking with valid request', async () => {
    // First, get a real time slot ID from the database
    const timeslotsResponse = await fetch(`${baseUrl}/api/timeslots`);
    const timeslots = await timeslotsResponse.json();

    if (timeslots.length === 0) {
      throw new Error('No time slots available for testing');
    }

    const bookingRequest = {
      timeslot_id: timeslots[0].id, // Use real UUID from database
    };

    const response = await fetch(`${baseUrl}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(bookingRequest),
    });

    // Test should pass now that endpoint is implemented
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/json');

    const data = await response.json();

    // Verify response structure matches OpenAPI spec
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('time_slot');
    expect(data).toHaveProperty('payment_status');
    expect(data).toHaveProperty('url');


    // Verify data types
    expect(typeof data.id).toBe('string');
    expect(typeof data.payment_status).toBe('string');
    expect(typeof data.url).toBe('string');


    // Verify UUID format for id
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(data.id).toMatch(uuidRegex);

    // Verify payment_status is one of the allowed values
    expect(['pending', 'paid', 'failed']).toContain(data.payment_status);

    // Verify time_slot structure
    expect(data.time_slot).toHaveProperty('id');
    expect(data.time_slot).toHaveProperty('start_time');
    expect(data.time_slot).toHaveProperty('end_time');
    expect(typeof data.time_slot.id).toBe('string');
    expect(typeof data.time_slot.start_time).toBe('string');
    expect(typeof data.time_slot.end_time).toBe('string');
  });

  it('should reject booking with invalid time_slot_id', async () => {
    const bookingRequest = {
      timeslot_id: 'invalid-uuid',
    };

    const response = await fetch(`${baseUrl}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(bookingRequest),
    });

    // Should return error for invalid UUID
    expect(response.status).toBe(400);
  });

  it('should reject booking with missing required fields', async () => {
    const bookingRequest = {
      // Missing timeslot_id
    };

    const response = await fetch(`${baseUrl}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(bookingRequest),
    });

    // Should return error for missing required field
    expect(response.status).toBe(400);
  });

  it('should reject booking for non-existent time slot', async () => {
    const bookingRequest = {
      timeslot_id: '00000000-0000-0000-0000-000000000000', // Non-existent UUID
    };

    const response = await fetch(`${baseUrl}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(bookingRequest),
    });

    // Should return error for non-existent time slot
    expect(response.status).toBe(404);
  });

  it('should reject booking for already booked time slot', async () => {
    // First, get a real time slot ID from the database
    const timeslotsResponse = await fetch(`${baseUrl}/api/timeslots`);
    const timeslots = await timeslotsResponse.json();

    if (timeslots.length === 0) {
      throw new Error('No time slots available for testing');
    }

    // First, create a booking
    const bookingRequest = {
      timeslot_id: timeslots[0].id, // Use real UUID from database
    };

    const firstResponse = await fetch(`${baseUrl}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(bookingRequest),
    });

    // If first booking succeeds, try to book the same slot again
    if (firstResponse.status === 200) {
      const secondBookingRequest = {
        time_slot_id: timeslots[0].id, // Use the same time slot ID
      };

      const secondResponse = await fetch(`${baseUrl}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(secondBookingRequest),
      });

      // Should return error for already booked time slot
      expect(secondResponse.status).toBe(409); // Conflict
    }
  });

  it('should handle malformed JSON request', async () => {
    const response = await fetch(`${baseUrl}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: 'invalid json',
    });

    // Should return error for malformed JSON
    expect(response.status).toBe(400);
  });
});