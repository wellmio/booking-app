'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { BookingOption, TimeSlot, Booking } from '@/lib/db/schema';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';

export default function AdminOptionsPage() {
  const router = useRouter();

  // Booking Options State
  const [bookingOptions, setBookingOptions] = useState<BookingOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingOption, setEditingOption] = useState<BookingOption | null>(
    null
  );
  const [editValue, setEditValue] = useState('');

  // Timeslots Management State
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'options' | 'timeslots'>(
    'timeslots'
  );
  const [isLoadingTimeslots, setIsLoadingTimeslots] = useState(false);
  const [isCreatingTimeslot, setIsCreatingTimeslot] = useState(false);
  const [newTimeslotStart, setNewTimeslotStart] = useState('');

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

  const fetchTimeslots = useCallback(async () => {
    if (!selectedDate) return;

    try {
      setIsLoadingTimeslots(true);
      setError(null);

      const token = localStorage.getItem('adminToken');
      const dateString = selectedDate.toISOString().split('T')[0];

      // Fetch timeslots for selected date
      const timeslotsResponse = await fetch(
        `/api/timeslots?date=${dateString}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!timeslotsResponse.ok) {
        throw new Error('Failed to fetch timeslots');
      }

      const timeslotsData = await timeslotsResponse.json();
      setTimeSlots(timeslotsData);

      // Fetch all bookings to see which timeslots are booked
      const bookingsResponse = await fetch('/api/admin/bookings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoadingTimeslots(false);
    }
  }, [selectedDate]);

  // Calculate end time based on duration_minutes option
  const calculateEndTime = (startTime: string): string => {
    const durationOption = bookingOptions.find(
      opt => opt.name === 'duration_minutes'
    );
    const durationMinutes = durationOption
      ? parseInt(durationOption.value)
      : 30;

    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);

    const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);

    return `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
  };

  const createTimeslot = async () => {
    if (!selectedDate || !newTimeslotStart) {
      setError('Please select a date and start time');
      return;
    }

    try {
      setIsCreatingTimeslot(true);
      setError(null);

      const token = localStorage.getItem('adminToken');
      const startDateTime = new Date(
        `${selectedDate.toISOString().split('T')[0]}T${newTimeslotStart}:00`
      );

      // Auto-calculate end time based on duration
      const endTime = calculateEndTime(newTimeslotStart);
      const endDateTime = new Date(
        `${selectedDate.toISOString().split('T')[0]}T${endTime}:00`
      );

      const response = await fetch('/api/admin/timeslots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('adminToken');
          router.push('/admin/login');
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create timeslot');
      }

      setSuccess('Timeslot created successfully!');
      setNewTimeslotStart('');

      // Refresh timeslots
      fetchTimeslots();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsCreatingTimeslot(false);
    }
  };

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchBookingOptions();
    if (activeTab === 'timeslots') {
      fetchTimeslots();
    }
  }, [router, fetchBookingOptions, fetchTimeslots, activeTab]);

  // Fetch timeslots when date changes
  useEffect(() => {
    if (activeTab === 'timeslots') {
      fetchTimeslots();
    }
  }, [selectedDate, fetchTimeslots, activeTab]);

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
    <div className="min-h-screen bg-[#f1d4af]">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-[#737D6F]">
                Admin Dashboard
              </h1>
              <p className="text-[#687258]">
                Manage timeslots, bookings, and system settings
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/book"
                className="text-[#D8794F] hover:text-[#c76b40] text-sm font-medium"
              >
                View Booking Page
              </a>
              <button
                onClick={handleLogout}
                className="bg-[#D8794F] text-white px-4 py-2 rounded-md hover:bg-[#c76b40] text-sm"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('timeslots')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'timeslots'
                    ? 'border-[#D8794F] text-[#D8794F]'
                    : 'border-transparent text-[#687258] hover:text-[#737D6F] hover:border-gray-300'
                }`}
              >
                Timeslot Management
              </button>
              <button
                onClick={() => setActiveTab('options')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'options'
                    ? 'border-[#D8794F] text-[#D8794F]'
                    : 'border-transparent text-[#687258] hover:text-[#737D6F] hover:border-gray-300'
                }`}
              >
                Booking Options
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error and Success Messages */}
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
                <h3 className="text-sm font-medium text-green-800">Success</h3>
                <div className="mt-2 text-sm text-green-700">{success}</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'timeslots' ? (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-[#737D6F]">
                Timeslot Management
              </h2>
              <p className="text-[#687258] text-sm">
                View and manage available timeslots for bookings
              </p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Date Selection */}
                <div>
                  <h3 className="text-lg font-medium text-[#737D6F] mb-4">
                    Select Date
                  </h3>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border border-[#ececec]"
                  />
                </div>

                {/* Current Timeslots */}
                <div>
                  <h3 className="text-lg font-medium text-[#737D6F] mb-4">
                    Current Timeslots
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
                  </h3>

                  {isLoadingTimeslots ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#D8794F]"></div>
                      <p className="mt-2 text-[#687258] text-sm">Loading...</p>
                    </div>
                  ) : timeSlots.length === 0 ? (
                    <div className="text-center py-8 text-[#687258]">
                      <p>No timeslots for this date.</p>
                      <p className="text-sm mt-1">
                        Create new timeslots below.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {timeSlots.map(timeslot => {
                        const booking = bookings.find(
                          b => b.timeslot_id === timeslot.id
                        );
                        const isBooked = timeslot.is_booked || !!booking;

                        return (
                          <div
                            key={timeslot.id}
                            className={`p-4 border rounded-lg ${
                              isBooked
                                ? 'border-red-200 bg-red-50'
                                : 'border-green-200 bg-green-50'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium text-[#333333]">
                                  {new Date(
                                    timeslot.start_time
                                  ).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}{' '}
                                  -{' '}
                                  {new Date(
                                    timeslot.end_time
                                  ).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </div>
                                <div
                                  className={`text-sm ${isBooked ? 'text-red-600' : 'text-green-600'}`}
                                >
                                  {isBooked ? '🔴 Booked' : '🟢 Available'}
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                {!isBooked && (
                                  <button
                                    onClick={() => {
                                      /* TODO: Edit timeslot */
                                    }}
                                    className="text-[#D8794F] hover:text-[#c76b40] text-sm"
                                  >
                                    Edit
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    /* TODO: Delete timeslot */
                                  }}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                  disabled={isBooked}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Create New Timeslot */}
                <div>
                  <h3 className="text-lg font-medium text-[#737D6F] mb-4">
                    Create New Timeslot
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#687258] mb-2">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={newTimeslotStart}
                        onChange={e => setNewTimeslotStart(e.target.value)}
                        className="w-full px-3 py-2 border border-[#ececec] rounded-md focus:outline-none focus:ring-2 focus:ring-[#D8794F] focus:border-[#D8794F]"
                      />
                    </div>

                    {newTimeslotStart && (
                      <div className="p-3 bg-[#f1d4af]/30 border border-[#ececec] rounded-md">
                        <p className="text-sm text-[#687258]">
                          <strong>End Time:</strong>{' '}
                          {calculateEndTime(newTimeslotStart)}
                        </p>
                        <p className="text-xs text-[#687258] mt-1">
                          Duration:{' '}
                          {bookingOptions.find(
                            opt => opt.name === 'duration_minutes'
                          )?.value || '30'}{' '}
                          minutes
                        </p>
                      </div>
                    )}

                    <Button
                      onClick={createTimeslot}
                      disabled={
                        !selectedDate || !newTimeslotStart || isCreatingTimeslot
                      }
                      className="w-full bg-[#D8794F] text-white hover:bg-[#c76b40]"
                    >
                      {isCreatingTimeslot ? 'Creating...' : 'Create Timeslot'}
                    </Button>

                    {selectedDate && (
                      <p className="text-sm text-[#687258]">
                        Creating timeslot for{' '}
                        {selectedDate.toLocaleDateString('en-US')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-[#737D6F]">
                Booking Options
              </h2>
              <p className="text-[#687258] text-sm">
                Configure system settings for the booking system
              </p>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {bookingOptions.map(option => (
                  <div
                    key={option.id}
                    className="border border-[#ececec] rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-[#737D6F] capitalize">
                          {option.name.replace(/_/g, ' ')}
                        </h3>
                        <p className="text-sm text-[#687258] mt-1">
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
                              className="px-3 py-1 border border-[#ececec] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#D8794F] focus:border-[#D8794F]"
                              placeholder="Enter value"
                            />
                            <button
                              onClick={handleSaveOption}
                              disabled={isSaving || !editValue.trim()}
                              className="bg-[#D8794F] text-white px-3 py-1 rounded-md hover:bg-[#c76b40] text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isSaving ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              disabled={isSaving}
                              className="bg-[#687258] text-white px-3 py-1 rounded-md hover:bg-[#737D6F] text-sm disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-[#333333]">
                              {option.value}
                            </span>
                            <button
                              onClick={() => handleEditOption(option)}
                              className="text-[#D8794F] hover:text-[#c76b40] text-sm"
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
                <div className="text-center py-8 text-[#687258]">
                  <p>No booking options found.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
