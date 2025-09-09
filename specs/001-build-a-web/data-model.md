# Data Model: Web App for Massage Chair Booking

## Entities

### User

Represents a customer booking an appointment.

- `id`: UUID (Primary Key)
- `email`: Text
- `created_at`: Timestamp

### Appointment

Represents a single booking.

- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to User)
- `time_slot_id`: UUID (Foreign Key to TimeSlot)
- `payment_status`: Enum ("pending", "succeeded", "failed")
- `stripe_payment_intent_id`: Text
- `created_at`: Timestamp

### TimeSlot

Represents an available booking time.

- `id`: UUID (Primary Key)
- `start_time`: Timestamp
- `end_time`: Timestamp
- `status`: Enum ("available", "booked")
- `created_at`: Timestamp

### Admin

Represents a user with administrative privileges.

- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to auth.users)

### BookingOption

Represents a configurable setting for appointments.

- `id`: UUID (Primary Key)
- `name`: Text (e.g., "price", "duration_minutes")
- `value`: Text
- `created_at`: Timestamp
