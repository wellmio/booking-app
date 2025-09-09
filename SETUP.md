# Setup Instructions

This document provides step-by-step instructions for setting up the Wellmio Booking web application.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git

## Environment Setup

1. Copy the environment template:

   ```bash
   cp env.template .env.local
   ```

2. Fill in the following services with your actual credentials:

### Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In your project dashboard, go to Settings > API
3. Copy the Project URL and anon public key to your `.env.local`
4. Copy the service_role key (keep this secret) to your `.env.local`
5. Run the database migration:
   ```bash
   npx supabase db push
   ```

### Stripe Setup

1. Go to [stripe.com](https://stripe.com) and create an account
2. In the Stripe dashboard, go to Developers > API keys
3. Copy the Publishable key and Secret key to your `.env.local`
4. Set up webhooks for payment processing (optional for development)

### Resend Setup

1. Go to [resend.com](https://resend.com) and create an account
2. Generate an API key in your dashboard
3. Copy the API key to your `.env.local`

### Upstash Redis Setup

1. Go to [upstash.com](https://upstash.com) and create an account
2. Create a new Redis database
3. Copy the REST URL and token to your `.env.local`

### Sentry Setup

1. Go to [sentry.io](https://sentry.io) and create an account
2. Create a new project for Next.js
3. Copy the DSN and other configuration values to your `.env.local`

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── (api)/             # API routes
│   ├── (app)/             # Frontend pages
│   └── components/        # Reusable components
├── lib/                   # Utility functions and configurations
├── supabase/              # Database migrations and config
├── tests/                 # Test files
└── specs/                 # Project specifications
```

## Next Steps

After completing the setup, you can proceed with the implementation tasks outlined in `specs/001-build-a-web/tasks.md`.
