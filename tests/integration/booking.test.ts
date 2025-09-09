import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';

/**
 * Integration Test for User Booking Flow
 * 
 * This test verifies the complete user booking flow as described in quickstart.md.
 * It should FAIL until the full implementation is complete.
 * 
 * Based on quickstart.md User Booking Flow:
 * 1. User navigates to booking page
 * 2. User sees list of available time slots
 * 3. User selects a time slot
 * 4. User is prompted to enter email
 * 5. User is redirected to Stripe for payment
 * 6. User completes payment successfully
 * 7. User is redirected back to confirmation page
 * 8. User receives confirmation email with booking details
 */

describe('User Booking Flow Integration', () => {
  let baseUrl: string;
  let testTimeSlotId: string;
  let testEmail: string;

  beforeAll(() => {
    baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';
    testEmail = 'integration-test@example.com';
  });

  afterAll(() => {
    // Cleanup test data if needed
  });

  beforeEach(() => {
    // Reset test state before each test
    testTimeSlotId = '';
  });

  describe('Complete User Booking Flow', () => {
    it('should complete the full booking flow from start to finish', async () => {
      // Step 1: User navigates to booking page
      // This would typically be a frontend page, but we'll test the API endpoints
      // that support this flow

      // Step 2: User sees list of available time slots
      const timeslotsResponse = await fetch(`${baseUrl}/api/timeslots`);
      expect(timeslotsResponse.status).toBe(200);
      
      const timeslots = await timeslotsResponse.json();
      expect(Array.isArray(timeslots)).toBe(true);
      
      // Find an available time slot for testing
      if (timeslots.length > 0) {
        testTimeSlotId = timeslots[0].id;
        expect(testTimeSlotId).toBeDefined();
        expect(typeof testTimeSlotId).toBe('string');
      } else {
        // If no time slots available, we need to create one first
        // This would typically be done through admin interface or test setup
        throw new Error('No available time slots for testing. Test setup required.');
      }

      // Step 3: User selects a time slot
      // This is handled in the frontend, but we verify the slot exists
      expect(testTimeSlotId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

      // Step 4: User is prompted to enter email
      // This is handled in the frontend, but we use a test email

      // Step 5: User is redirected to Stripe for payment
      // This would typically involve creating a payment intent
      // For now, we'll test the booking creation which should trigger payment flow
      
      // Step 6: User completes payment successfully
      // This is handled by Stripe, but we test the booking creation
      const bookingRequest = {
        time_slot_id: testTimeSlotId,
        email: testEmail
      };

      const bookingResponse = await fetch(`${baseUrl}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingRequest),
      });

      // This test should FAIL until the endpoint is implemented
      expect(bookingResponse.status).toBe(200);
      
      const booking = await bookingResponse.json();
      expect(booking).toHaveProperty('id');
      expect(booking).toHaveProperty('time_slot');
      expect(booking).toHaveProperty('payment_status');

      // Step 7: User is redirected back to confirmation page
      // This would be a frontend page showing booking confirmation
      // We verify the booking was created successfully
      expect(booking.time_slot.id).toBe(testTimeSlotId);
      expect(booking.payment_status).toBe('succeeded'); // Assuming successful payment

      // Step 8: User receives confirmation email with booking details
      // This would be handled by the email service (Resend)
      // We can't directly test email delivery, but we verify the booking exists
      expect(booking.id).toBeDefined();
      expect(typeof booking.id).toBe('string');
    });

    it('should handle payment failure gracefully', async () => {
      // Test the scenario where payment fails
      const timeslotsResponse = await fetch(`${baseUrl}/api/timeslots`);
      expect(timeslotsResponse.status).toBe(200);
      
      const timeslots = await timeslotsResponse.json();
      if (timeslots.length === 0) {
        throw new Error('No available time slots for testing. Test setup required.');
      }

      const testTimeSlotId = timeslots[0].id;
      const bookingRequest = {
        time_slot_id: testTimeSlotId,
        email: 'payment-fail-test@example.com'
      };

      // Simulate payment failure by using a test email that triggers failure
      const bookingResponse = await fetch(`${baseUrl}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingRequest),
      });

      // The booking should still be created but with failed payment status
      expect(bookingResponse.status).toBe(200);
      
      const booking = await bookingResponse.json();
      expect(booking.payment_status).toBe('failed');
      
      // The time slot should still be available for rebooking
      const updatedTimeslotsResponse = await fetch(`${baseUrl}/api/timeslots`);
      const updatedTimeslots = await updatedTimeslotsResponse.json();
      
      // The time slot should still be available
      const stillAvailable = updatedTimeslots.some((slot: any) => slot.id === testTimeSlotId);
      expect(stillAvailable).toBe(true);
    });

    it('should prevent double booking of the same time slot', async () => {
      const timeslotsResponse = await fetch(`${baseUrl}/api/timeslots`);
      expect(timeslotsResponse.status).toBe(200);
      
      const timeslots = await timeslotsResponse.json();
      if (timeslots.length === 0) {
        throw new Error('No available time slots for testing. Test setup required.');
      }

      const testTimeSlotId = timeslots[0].id;
      
      // First booking
      const firstBookingRequest = {
        time_slot_id: testTimeSlotId,
        email: 'first-booking@example.com'
      };

      const firstBookingResponse = await fetch(`${baseUrl}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(firstBookingRequest),
      });

      expect(firstBookingResponse.status).toBe(200);
      const firstBooking = await firstBookingResponse.json();
      expect(firstBooking.payment_status).toBe('succeeded');

      // Second booking attempt for the same time slot
      const secondBookingRequest = {
        time_slot_id: testTimeSlotId,
        email: 'second-booking@example.com'
      };

      const secondBookingResponse = await fetch(`${baseUrl}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(secondBookingRequest),
      });

      // Should return conflict error
      expect(secondBookingResponse.status).toBe(409);
    });

    it('should handle concurrent booking attempts', async () => {
      const timeslotsResponse = await fetch(`${baseUrl}/api/timeslots`);
      expect(timeslotsResponse.status).toBe(200);
      
      const timeslots = await timeslotsResponse.json();
      if (timeslots.length === 0) {
        throw new Error('No available time slots for testing. Test setup required.');
      }

      const testTimeSlotId = timeslots[0].id;
      
      // Simulate concurrent booking attempts
      const bookingPromises = [
        fetch(`${baseUrl}/api/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            time_slot_id: testTimeSlotId,
            email: 'concurrent-1@example.com'
          }),
        }),
        fetch(`${baseUrl}/api/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            time_slot_id: testTimeSlotId,
            email: 'concurrent-2@example.com'
          }),
        }),
      ];

      const responses = await Promise.all(bookingPromises);
      
      // One should succeed, one should fail
      const successCount = responses.filter(r => r.status === 200).length;
      const conflictCount = responses.filter(r => r.status === 409).length;
      
      expect(successCount).toBe(1);
      expect(conflictCount).toBe(1);
    });

    it('should validate email format during booking', async () => {
      const timeslotsResponse = await fetch(`${baseUrl}/api/timeslots`);
      expect(timeslotsResponse.status).toBe(200);
      
      const timeslots = await timeslotsResponse.json();
      if (timeslots.length === 0) {
        throw new Error('No available time slots for testing. Test setup required.');
      }

      const testTimeSlotId = timeslots[0].id;
      
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'test@',
        'test.example.com',
        '',
        'test@.com',
        'test@example.',
      ];

      for (const invalidEmail of invalidEmails) {
        const bookingRequest = {
          time_slot_id: testTimeSlotId,
          email: invalidEmail
        };

        const response = await fetch(`${baseUrl}/api/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingRequest),
        });

        expect(response.status).toBe(400);
      }
    });

    it('should handle time slot becoming unavailable during booking process', async () => {
      // This test simulates the scenario where a time slot becomes unavailable
      // between when the user sees it and when they try to book it
      
      const timeslotsResponse = await fetch(`${baseUrl}/api/timeslots`);
      expect(timeslotsResponse.status).toBe(200);
      
      const timeslots = await timeslotsResponse.json();
      if (timeslots.length === 0) {
        throw new Error('No available time slots for testing. Test setup required.');
      }

      const testTimeSlotId = timeslots[0].id;
      
      // Simulate another user booking the slot first
      const otherUserBooking = {
        time_slot_id: testTimeSlotId,
        email: 'other-user@example.com'
      };

      const otherUserResponse = await fetch(`${baseUrl}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(otherUserBooking),
      });

      expect(otherUserResponse.status).toBe(200);

      // Now try to book the same slot
      const bookingRequest = {
        time_slot_id: testTimeSlotId,
        email: 'late-booking@example.com'
      };

      const response = await fetch(`${baseUrl}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingRequest),
      });

      // Should return conflict error
      expect(response.status).toBe(409);
    });
  });
});
