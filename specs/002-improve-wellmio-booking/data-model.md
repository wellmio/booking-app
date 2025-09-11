# Data Model

This document defines the data model for the booking feature.

## Entities

### Booking

Represents a reservation made by a user.

- **id**: `uuid` (primary key)
- **created_at**: `timestamp`
- **user_id**: `uuid` (foreign key to `users` table)
- **timeslot_id**: `uuid` (foreign key to `timeslots` table)
- **payment_status**: `enum` (`pending`, `paid`, `failed`)
- **stripe_session_id**: `string`

### Time Slot

Represents a period of time available for booking.

- **id**: `uuid` (primary key)
- **start_time**: `timestamp`
- **end_time**: `timestamp`
- **is_booked**: `boolean` (defaults to `false`)

### Payment

Represents a transaction processed through Stripe. This is not a database table, but a representation of the data we get from Stripe.

- **id**: `string` (from Stripe)
- **amount**: `integer`
- **currency**: `string`
- **status**: `string` (from Stripe)
- **booking_id**: `uuid`
