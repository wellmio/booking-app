// Mock data stores
const mockTimeslots = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
    is_booked: false,
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174001',
    start_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
    is_booked: false,
  },
];

const mockBookings: any[] = [];

const createMockQueryBuilder = (table: string) => {
  const queryBuilder = {
    select: jest.fn().mockReturnValue(queryBuilder),
    insert: jest.fn().mockReturnValue(queryBuilder),
    update: jest.fn().mockReturnValue(queryBuilder),
    delete: jest.fn().mockReturnValue(queryBuilder),
    eq: jest.fn().mockReturnValue(queryBuilder),
    gte: jest.fn().mockReturnValue(queryBuilder),
    lt: jest.fn().mockReturnValue(queryBuilder),
    order: jest.fn().mockReturnValue(queryBuilder),
    single: jest.fn(),
    maybeSingle: jest.fn(),
  };

  // Configure different behaviors based on table
  if (table === 'timeslots') {
    queryBuilder.single.mockResolvedValue({ 
      data: mockTimeslots[0], 
      error: null 
    });
    queryBuilder.maybeSingle.mockResolvedValue({ 
      data: mockTimeslots[0], 
      error: null 
    });
    
    // Mock insert for timeslots
    queryBuilder.insert.mockImplementation(() => ({
      ...queryBuilder,
      select: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({
          data: {
            id: 'new-timeslot-id',
            start_time: new Date().toISOString(),
            end_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
            is_booked: false,
          },
          error: null,
        }),
      }),
    }));

    // Mock update for timeslots
    queryBuilder.update.mockImplementation(() => ({
      ...queryBuilder,
      eq: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: {
              id: '00000000-0000-0000-0000-000000000000',
              start_time: new Date().toISOString(),
              end_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
              is_booked: false,
            },
            error: null,
          }),
        }),
      }),
    }));

    // Mock delete for timeslots
    queryBuilder.delete.mockImplementation(() => ({
      eq: jest.fn().mockResolvedValue({ error: null }),
    }));

  } else if (table === 'bookings') {
    queryBuilder.single.mockResolvedValue({ 
      data: {
        id: 'booking-123',
        user_id: 'test-user-id',
        timeslot_id: '123e4567-e89b-12d3-a456-426614174000',
        payment_status: 'pending',
        stripe_session_id: null,
        created_at: new Date().toISOString(),
      }, 
      error: null 
    });

    // Mock insert for bookings
    queryBuilder.insert.mockImplementation(() => ({
      ...queryBuilder,
      select: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({
          data: {
            id: 'new-booking-id',
            user_id: 'test-user-id',
            timeslot_id: '123e4567-e89b-12d3-a456-426614174000',
            payment_status: 'pending',
            stripe_session_id: null,
            created_at: new Date().toISOString(),
          },
          error: null,
        }),
      }),
    }));

    // Mock update for bookings
    queryBuilder.update.mockImplementation(() => ({
      eq: jest.fn().mockResolvedValue({ error: null }),
    }));

    // Mock select for bookings (admin endpoint)
    queryBuilder.select.mockImplementation(() => ({
      ...queryBuilder,
      order: jest.fn().mockResolvedValue({ 
        data: mockBookings, 
        error: null 
      }),
    }));
  }

  // Default behavior for unhandled cases
  if (!queryBuilder.single.mock.calls.length) {
    queryBuilder.single.mockResolvedValue({ data: null, error: null });
  }
  
  return queryBuilder;
};

export const createClient = jest.fn().mockReturnValue({
  auth: {
    getUser: jest.fn().mockImplementation(() => {
      // Check if we have a valid auth token in the test environment
      const authToken = process.env.TEST_USER_TOKEN || 'mock-user-token';
      if (authToken === 'mock-user-token') {
        return Promise.resolve({
          data: { user: { id: 'test-user-id' } },
          error: null,
        });
      }
      return Promise.resolve({
        data: { user: null },
        error: { message: 'Unauthorized' },
      });
    }),
  },
  from: jest.fn((table: string) => createMockQueryBuilder(table)),
});
