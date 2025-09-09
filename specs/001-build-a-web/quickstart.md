# Quickstart: Web App for Massage Chair Booking

## User Booking Flow

1. **Given** a user navigates to the booking page.
2. **When** they see a list of available time slots.
3. **And** they select a time slot.
4. **And** they are prompted to enter their email.
5. **And** they are redirected to Stripe for payment.
6. **And** they complete the payment successfully.
7. **Then** they are redirected back to a confirmation page.
8. **And** they receive a confirmation email with the booking details.

## Admin Management Flow

1. **Given** an admin user navigates to the admin login page.
2. **When** they log in with their credentials.
3. **And** they navigate to the "Booking Options" page.
4. **Then** they see a list of current booking options (e.g., price, duration).
5. **When** they edit an option and save the changes.
6. **Then** the new option is reflected in the user booking flow.
