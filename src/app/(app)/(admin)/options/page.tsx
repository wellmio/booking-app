'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { BookingOption } from '@/lib/db/schema';

export default function AdminOptionsPage() {
  const router = useRouter();
  const [bookingOptions, setBookingOptions] = useState<BookingOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingOption, setEditingOption] = useState<BookingOption | null>(
    null
  );
  const [editValue, setEditValue] = useState('');

  const fetchBookingOptions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/booking-options', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('adminToken');
          router.push('/admin/login');
          return;
        }
        throw new Error('Failed to fetch booking options');
      }

      const data = await response.json();
      setBookingOptions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchBookingOptions();
  }, [router, fetchBookingOptions]);

  const handleEditOption = (option: BookingOption) => {
    setEditingOption(option);
    setEditValue(option.value);
  };

  const handleCancelEdit = () => {
    setEditingOption(null);
    setEditValue('');
  };

  const handleSaveOption = async () => {
    if (!editingOption || !editValue.trim()) {
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/booking-options', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: editingOption.id,
          name: editingOption.name,
          value: editValue.trim(),
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('adminToken');
          router.push('/admin/login');
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update booking option');
      }

      const updatedOption = await response.json();

      // Update the local state
      setBookingOptions(prev =>
        prev.map(option =>
          option.id === updatedOption.id ? updatedOption : option
        )
      );

      setSuccess('Booking option updated successfully!');
      setEditingOption(null);
      setEditValue('');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const getOptionDescription = (name: string) => {
    const descriptions: Record<string, string> = {
      price: 'Price per session in SEK',
      duration_minutes: 'Duration of each session in minutes',
      max_bookings_per_day: 'Maximum number of bookings allowed per day',
      booking_window_days: 'How many days in advance users can book',
      currency: 'Currency code (e.g., SEK, USD)',
      timezone: 'Timezone for the booking system',
    };
    return descriptions[name] || 'Booking option';
  };

  const getOptionInputType = (name: string) => {
    if (name === 'price') return 'number';
    if (
      name === 'duration_minutes' ||
      name === 'max_bookings_per_day' ||
      name === 'booking_window_days'
    )
      return 'number';
    return 'text';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading booking options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Manage booking options and settings
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/book"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                View Booking Page
              </a>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Booking Options
            </h2>
            <p className="text-gray-600 text-sm">
              Configure system settings for the booking system
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

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Success
                    </h3>
                    <div className="mt-2 text-sm text-green-700">{success}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {bookingOptions.map(option => (
                <div
                  key={option.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 capitalize">
                        {option.name.replace(/_/g, ' ')}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {getOptionDescription(option.name)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      {editingOption?.id === option.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type={getOptionInputType(option.name)}
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter value"
                          />
                          <button
                            onClick={handleSaveOption}
                            disabled={isSaving || !editValue.trim()}
                            className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSaving ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            disabled={isSaving}
                            className="bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 text-sm disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            {option.value}
                          </span>
                          <button
                            onClick={() => handleEditOption(option)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {bookingOptions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No booking options found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
