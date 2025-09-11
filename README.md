# Wellmio Booking System

A Next.js application for booking massage chair sessions at Wellmio wellness studios. This system provides a seamless booking experience with real-time availability, secure payments, and admin management capabilities.

## Features

- **User Booking Flow**: Browse available time slots and book massage chair sessions
- **Admin Management**: Configure booking options and manage system settings
- **Real-time Availability**: Live time slot updates with caching support
- **Secure Authentication**: Admin access with token-based authentication
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Database Integration**: Supabase for data persistence and Redis for caching

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Supabase account (for production)
- Upstash Redis account (optional, for caching)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/wellmio/booking-app.git
cd booking-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up environment variables:
```bash
cp env.template .env.local
```

Edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_TOKEN=your_admin_token
UPSTASH_REDIS_REST_URL=your_redis_url (optional)
UPSTASH_REDIS_REST_TOKEN=your_redis_token (optional)
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Supported Routes

### Public Pages
- **`/`** - Home page with company information and booking CTA
- **`/book`** - User booking page to select time slots and create bookings
- **`/book/confirmation`** - Booking confirmation page with details

### Admin Pages
- **`/login`** - Admin login page
- **`/options`** - Admin options management page

### API Routes

#### Public APIs
- **`GET /api/timeslots`** - Get available time slots for booking
- **`POST /api/bookings`** - Create a new booking
- **`GET /api/test-supabase`** - Test Supabase connection

#### Admin APIs (Requires Authentication)
- **`GET /api/admin/booking-options`** - Get all booking configuration options
- **`PUT /api/admin/booking-options`** - Update booking configuration options

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Caching**: Upstash Redis
- **Authentication**: Token-based admin auth
- **Testing**: Jest with contract and integration tests
- **Linting**: ESLint + Prettier

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run test` - Run all tests
- `npm run test:contract` - Run contract tests
- `npm run test:integration` - Run integration tests

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (app)/             # Route groups
│   │   ├── (admin)/       # Admin pages
│   │   └── (user)/        # User pages
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── lib/                   # Shared utilities
│   ├── db/               # Database schema and types
│   ├── supabase.ts       # Supabase client
│   └── stripe.ts         # Stripe integration
└── tests/                # Test files
    ├── contract/         # API contract tests
    ├── integration/      # Integration tests
    └── unit/            # Unit tests
```

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.