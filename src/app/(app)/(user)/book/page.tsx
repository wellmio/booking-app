'use client';

import { useState, useEffect } from 'react';
import { TimeSlot, BookingRequest } from '@/lib/db/schema';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';

type BookingPageProps = Record<string, never>;

export default function BookingPage({}: BookingPageProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch available time slots for selected date
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!selectedDate) return;

      try {
        setIsLoading(true);
        setSelectedTimeSlot(null); // Clear selection when date changes

        // Format date for API query
        const dateString = selectedDate.toISOString().split('T')[0];
        const response = await fetch(`/api/timeslots?date=${dateString}`);

        if (!response.ok) {
          throw new Error('Failed to fetch time slots');
        }

        const data = await response.json();
        setTimeSlots(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimeSlots();
  }, [selectedDate]);

  // Handle time slot selection
  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setError(null);
  };

  // Handle booking submission
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTimeSlot) {
      setError('Please select a time slot');
      return;
    }

    try {
      setIsBooking(true);
      setError(null);

      const bookingRequest: BookingRequest = {
        timeslot_id: selectedTimeSlot.id,
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingRequest),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }

      const bookingData = await response.json();

      // Redirect to Stripe Checkout
      if (bookingData.url) {
        window.location.href = bookingData.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1d4af] py-8">
      <div className="max-w-6xl mx-auto w-[90%]">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-[#D8794F] text-white">
            <h1 className="text-2xl font-bold">Book a Massage Chair Session</h1>
            <p className="text-orange-100 mt-1">
              Select a date and available time slot for your relaxation session
            </p>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#D8794F]"></div>
                <p className="mt-2 text-[#687258]">
                  Loading available time slots...
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Date Selection */}
                <div>
                  <h2 className="text-lg font-semibold text-[#737D6F] mb-4">
                    Select a Date
                  </h2>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={date => date < new Date()}
                    className="rounded-md border border-[#ececec]"
                  />
                </div>

                {/* Time Slots Selection */}
                <div>
                  <h2 className="text-lg font-semibold text-[#737D6F] mb-4">
                    Available Time Slots
                    {selectedDate && (
                      <span className="text-sm font-normal text-[#687258] block">
                        {selectedDate.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    )}
                  </h2>

                  {timeSlots.length === 0 ? (
                    <div className="text-center py-8 text-[#687258]">
                      <p>No available time slots for this date.</p>
                      <p className="text-sm mt-1">
                        Please select another date.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {timeSlots.map(timeSlot => (
                        <button
                          key={timeSlot.id}
                          onClick={() => handleTimeSlotSelect(timeSlot)}
                          className={`w-full p-4 text-left border rounded-lg transition-colors ${
                            selectedTimeSlot?.id === timeSlot.id
                              ? 'border-[#D8794F] bg-orange-50 text-[#D8794F]'
                              : 'border-[#ececec] hover:border-[#D8794F] hover:bg-orange-50'
                          }`}
                        >
                          <div className="font-medium">
                            {new Date(timeSlot.start_time).toLocaleTimeString(
                              'en-US',
                              {
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}{' '}
                            -{' '}
                            {new Date(timeSlot.end_time).toLocaleTimeString(
                              'en-US',
                              {
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </div>
                          <div className="text-sm text-[#687258]">
                            Duration: 30 minutes
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Booking Form */}
                <div>
                  <h2 className="text-lg font-semibold text-[#737D6F] mb-4">
                    Booking Details
                  </h2>

                  <form onSubmit={handleBookingSubmit} className="space-y-6">
                    {selectedTimeSlot && (
                      <div className="p-4 bg-[#f1d4af]/30 rounded-lg border border-[#ececec]">
                        <h3 className="font-medium text-[#737D6F] mb-2">
                          Selected Time Slot
                        </h3>
                        <p className="text-[#333333]">
                          {selectedDate?.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}{' '}
                          at{' '}
                          {new Date(
                            selectedTimeSlot.start_time
                          ).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <p className="text-sm text-[#687258] mt-1">
                          Duration: 30 minutes • Price: 150 SEK
                        </p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={!selectedTimeSlot || isBooking}
                      className="w-full bg-[#D8794F] text-white hover:bg-[#c76b40] disabled:opacity-50"
                    >
                      {isBooking
                        ? 'Creating Booking...'
                        : 'Book Now & Pay with Stripe'}
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
