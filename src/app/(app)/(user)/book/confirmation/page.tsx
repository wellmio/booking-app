'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { BookingResponse } from '@/lib/db/schema';

function BookingConfirmationInner() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) {
      setError('No booking ID provided');
      setIsLoading(false);
      return;
    }

    // In a real implementation, you would fetch the booking details from the API
    // For now, we'll simulate the booking data based on the ID
    const simulateBookingData = () => {
      setTimeout(() => {
        setBooking({
          id: bookingId,
          time_slot: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            start_time: new Date(
              Date.now() + 24 * 60 * 60 * 1000
            ).toISOString(), // Tomorrow
            end_time: new Date(
              Date.now() + 24 * 60 * 60 * 1000 + 30 * 60 * 1000
            ).toISOString(), // Tomorrow + 30 min
            is_booked: true,
          },
          payment_status: 'paid',
          url: '', // URL not needed for confirmation page
        });
        setIsLoading(false);
      }, 1000);
    };

    simulateBookingData();
  }, [bookingId]);

  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading booking confirmation...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex justify-center mb-4">
              <svg
                className="h-12 w-12 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Booking Not Found
            </h1>
            <p className="text-gray-600 mb-4">
              {error || 'The booking you are looking for could not be found.'}
            </p>
            <a
              href="/book"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Book a New Session
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 bg-green-600 text-white">
            <div className="flex items-center">
              <svg
                className="h-8 w-8 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div>
                <h1 className="text-2xl font-bold">Booking Confirmed!</h1>
                <p className="text-green-100 mt-1">
                  Your massage chair session has been successfully booked
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Booking Details */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Booking Details
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-mono text-sm text-gray-900">
                    {booking.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="text-gray-900">
                    {formatDate(booking.time_slot.start_time)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="text-gray-900">
                    {formatTime(booking.time_slot.start_time)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="text-gray-900">30 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.payment_status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : booking.payment_status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {booking.payment_status.charAt(0).toUpperCase() +
                      booking.payment_status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                Important Information
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Please arrive 5 minutes before your scheduled time</li>
                <li>
                  • A confirmation email has been sent to your email address
                </li>
                <li>
                  • You can cancel or reschedule up to 2 hours before your
                  appointment
                </li>
                <li>
                  • Contact us if you have any questions or need assistance
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/book"
                className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Book Another Session
              </a>
              <button
                onClick={() => window.print()}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
              >
                Print Confirmation
              </button>
            </div>

            {/* Contact Information */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Need Help?
              </h3>
              <p className="text-sm text-gray-600">
                If you have any questions about your booking, please contact us
                at{' '}
                <a
                  href="mailto:support@wellmio.com"
                  className="text-blue-600 hover:text-blue-800"
                >
                  support@wellmio.com
                </a>{' '}
                or call us at{' '}
                <a
                  href="tel:+46123456789"
                  className="text-blue-600 hover:text-blue-800"
                >
                  +46 123 456 789
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          Loading booking confirmation...
        </div>
      }
    >
      <BookingConfirmationInner />
    </Suspense>
  );
}
