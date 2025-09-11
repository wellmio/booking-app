export class Stripe {
  constructor(secretKey: string, config?: any) {}

  checkout = {
    sessions: {
      create: jest.fn().mockResolvedValue({
        id: 'cs_test_123',
        url: 'https://checkout.stripe.com/pay/cs_test_123',
      }),
    },
  };

  webhooks = {
    constructEvent: jest
      .fn()
      .mockImplementation((body: string, signature: string, secret: string) => {
        // Mock signature verification
        if (!signature) {
          throw new Error('Missing stripe-signature header');
        }

        if (signature === 't=123,v1=invalid') {
          throw new Error('Invalid signature');
        }

        // Return a mock event for valid signatures
        return {
          id: 'evt_test_webhook',
          object: 'event',
          type: 'checkout.session.completed',
          data: {
            object: {
              id: 'cs_test_123',
              metadata: {
                booking_id: 'booking-123',
              },
            },
          },
        };
      }),
  };
}
