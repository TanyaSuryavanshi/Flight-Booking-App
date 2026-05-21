# Flight Management Web App
Live Link - https://flight-booking-gm2gcvou0-tanya-suryavanshi-s-projects.vercel.app/

A production-ready flight booking application built with **Next.js 14 (App Router)**, **TypeScript**, **Supabase** (PostgreSQL + Auth + Realtime), **Zustand**, **Tailwind CSS**, and **next-pwa** for offline capability.

## Features

✈️ **Flight Search & Discovery** – Search flights by origin, destination, and departure date
🪑 **Real-time Seat Selection** – Interactive seat map with live availability updates via Supabase Realtime
👤 **User Authentication** – Secure sign-up and sign-in with Supabase Auth
📋 **Booking Management** – Create, view, and cancel bookings with PNR codes
🔄 **Reschedule Flights** – Change flight and seat with automatic fee calculation
💾 **Persistent State** – Zustand store with localStorage persistence
📱 **Responsive Design** – Mobile-first UI with Tailwind CSS
🔌 **Offline Support** – PWA manifest for installable app experience
🔐 **RLS Security** – Database-level access control with Row Level Security
📊 **Seed Data** – Pre-populated with 8 flights and realistic seat inventory

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, React 18, TypeScript |
| **Styling** | Tailwind CSS, clsx |
| **State** | Zustand with persist middleware |
| **Backend** | Supabase PostgreSQL, PostgREST API, RPC Functions |
| **Auth** | Supabase Auth (JWT), next-auth-helpers |
| **Real-time** | Supabase Realtime (broadcast/postgres_changes) |
| **Deployment** | Vercel, Docker, or Self-hosted Node |
| **Icons** | Lucide React |
| **Validation** | Zod |
| **PWA** | next-pwa 5.6.0 |

---

## Project Structure

```
flight-management-app/
├── app/                           # Next.js App Router
│   ├── layout.tsx                 # Root layout with SiteHeader
│   ├── page.tsx                   # Landing page
│   ├── search/page.tsx            # Flight search
│   ├── results/page.tsx           # Search results display
│   ├── book/page.tsx              # Booking confirmation (seat + passenger)
│   ├── confirmation/page.tsx      # Booking success
│   ├── auth/
│   │   ├── sign-in/page.tsx       # Sign in form
│   │   ├── sign-up/page.tsx       # Sign up form
│   ├── bookings/
│   │   ├── page.tsx               # My bookings list
│   │   ├── [id]/page.tsx          # Booking details & cancel
│   │   ├── [id]/reschedule/page.tsx # Reschedule flight
│   └── globals.css                # Global Tailwind styles
├── components/
│   ├── layout/site-header.tsx     # Navigation header
│   ├── search/flight-search-form.tsx # Search form
│   ├── results/flight-card.tsx    # Flight result card
│   ├── booking/passenger-form.tsx # Passenger info form
│   ├── seat-map/seat-map.tsx      # Real-time seat selection
│   ├── auth/
│   │   ├── auth-card.tsx          # Card wrapper
│   │   ├── sign-in-form.tsx       # Sign in form
│   │   ├── sign-up-form.tsx       # Sign up form
│   │   └── sign-out-button.tsx    # Logout button
│   └── ui/
│       ├── button.tsx             # Reusable button
│       ├── card.tsx               # Card wrapper
│       ├── input.tsx              # Input field
│       └── loader.tsx             # Loading spinner
├── lib/
│   ├── supabase/
│   │   ├── server.ts              # Server-side Supabase client
│   │   └── client.ts              # Browser Supabase client
│   ├── types/
│   │   └── db.ts                  # Database type definitions
│   ├── validations/
│   │   ├── flight.ts              # Zod schema for flight search
│   │   └── passenger.ts           # Zod schema for passenger form
│   └── helpers/pnr.ts             # PNR code generation
├── store/
│   ├── flight-store.ts            # Zustand flight state (search, booking)
│   └── user-store.ts              # Zustand user state (auth)
├── migrations/
│   └── 0001_initial_schema.sql    # Database schema, RLS, RPCs, triggers
├── seed.sql                        # Sample flight data
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── next.config.mjs                # Next.js config (PWA enabled)
├── tailwind.config.ts             # Tailwind CSS config
├── postcss.config.mjs             # PostCSS config
├── public/
│   ├── manifest.json              # PWA manifest
│   └── ...                        # Static assets
├── .env.example                   # Environment variables template
└── README.md                      # This file
```

---

## Installation & Setup

### Prerequisites
- **Node.js** 18+ (with npm)
- **Supabase** account (free tier available at [supabase.com](https://supabase.com))
- **Git**

### 1. Clone & Install Dependencies

```bash
git clone <your-repo-url>
cd flight-management-app
npm install
```

### 2. Set Up Supabase

1. **Create a Supabase project** at [app.supabase.com](https://app.supabase.com)
2. **Go to Project Settings** → **API** to obtain:
   - **NEXT_PUBLIC_SUPABASE_URL** (e.g., `https://xyzcompany.supabase.co`)
   - **NEXT_PUBLIC_SUPABASE_ANON_KEY** (public JWT key)

### 3. Initialize Database

1. **Open Supabase SQL Editor** in your project dashboard
2. **Copy & paste** the contents of `migrations/0001_initial_schema.sql`
3. **Execute** to create tables, RLS policies, RPC functions, and triggers

#### What Gets Created:
- **Tables**: `flights`, `seats`, `bookings`, `passengers`, `reschedules`
- **RPC Functions**: `create_booking()`, `cancel_booking()`, `reschedule_booking()`, `reserve_seat()`, `release_seat()`
- **Realtime Triggers**: Auto-update seat availability on booking
- **RLS Policies**: Secure access per authenticated user

### 4. Seed Sample Data

1. **Open Supabase SQL Editor** again
2. **Copy & paste** the contents of `seed.sql`
3. **Execute** to insert 8 sample flights and 120 seats

### 5. Create .env.local

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage Guide

### 1. **Landing Page**
   - Browse featured flights
   - Quick access to search and auth

### 2. **Sign Up / Sign In**
   - Create an account or log in
   - Email and password authentication
   - Session persists via Zustand store

### 3. **Search Flights**
   - Enter origin (e.g., "LAX"), destination (e.g., "JFK"), date, and passenger count
   - Results displayed with airlines, prices, and times

### 4. **Book a Flight**
   - Select a flight from results
   - View real-time seat map (updates as other users book)
   - Choose seat and enter passenger details
   - Confirm booking

### 5. **My Bookings**
   - View all your reservations with PNR codes
   - Check booking status and details
   - Cancel or reschedule flights

### 6. **Reschedule Flight**
   - Select a new flight from available options on the same route
   - Choose a new seat
   - Automatic fee calculation (price difference)
   - Confirm reschedule

---

## Database Schema Overview

### Tables

#### `flights`
```sql
id UUID PRIMARY KEY
flight_no VARCHAR (e.g., "FL001")
origin VARCHAR (e.g., "LAX")
destination VARCHAR (e.g., "JFK")
departs_at TIMESTAMPTZ
arrives_at TIMESTAMPTZ
aircraft_type VARCHAR (e.g., "Boeing 777")
status: on-time | delayed | cancelled | boarding
base_price DECIMAL (in USD)
created_at TIMESTAMPTZ
```

#### `seats`
```sql
id UUID PRIMARY KEY
flight_id UUID FK → flights.id
seat_number VARCHAR (e.g., "12A")
class: economy | business | first
is_available BOOLEAN (updated by triggers)
extra_fee DECIMAL (seat premium)
```

#### `bookings`
```sql
id UUID PRIMARY KEY
user_id UUID FK → auth.users.id
flight_id UUID FK → flights.id
seat_id UUID FK → seats.id
status: pending | confirmed | cancelled | rescheduled
booked_at TIMESTAMPTZ
total_price DECIMAL
pnr_code VARCHAR (unique)
```

#### `passengers`
```sql
id UUID PRIMARY KEY
booking_id UUID FK → bookings.id
full_name VARCHAR
passport_no VARCHAR
nationality VARCHAR
dob DATE
```

#### `reschedules`
```sql
id UUID PRIMARY KEY
booking_id UUID FK → bookings.id
old_flight_id UUID FK → flights.id
new_flight_id UUID FK → flights.id
requested_at TIMESTAMPTZ
fee_charged DECIMAL
```

### RPC Functions

1. **`create_booking(user_uuid, flight_uuid, seat_uuid, passenger_full_name, passenger_passport_no, passenger_nationality, passenger_dob, total, pnr)`**
   - Creates booking + passenger record in a transaction
   - Marks seat as unavailable

2. **`cancel_booking(booking_uuid)`**
   - Cancels booking and releases seat

3. **`reschedule_booking(booking_uuid, new_flight_uuid, new_seat_uuid, fee_charged)`**
   - Updates booking, releases old seat, reserves new seat

4. **`reserve_seat(flight_uuid, seat_uuid)` & `release_seat(booking_uuid)`**
   - Manual seat reservation/release (used internally)

---

## Deployment

### Option 1: Vercel (Recommended)

**Easiest deployment for Next.js apps:**

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click **Import Project** → select your GitHub repo
   - Choose **Framework**: Next.js
   - Click **Deploy**

3. **Add Environment Variables** in Vercel Dashboard:
   - **NEXT_PUBLIC_SUPABASE_URL**
   - **NEXT_PUBLIC_SUPABASE_ANON_KEY**

4. **Deploy** – Vercel automatically builds and deploys on every `git push`

**Vercel + Supabase Benefits:**
- Free tier supports ~100k monthly requests
- Automatic SSL, CDN, serverless functions
- Built-in analytics and edge middleware

---

### Option 2: Self-Hosted (Node.js + Docker)

**For full control or custom infrastructure:**

#### Build for Production

```bash
npm run build
npm start
```

Server runs on `:3000` by default.

#### Docker Deployment

1. **Create `Dockerfile`:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy source
COPY . .

# Build Next.js app
RUN npm run build

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
```

2. **Build and run:**

```bash
docker build -t flight-app .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=<your-url> \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-key> \
  flight-app
```

#### Environment Variables for Production

Create `.env.production` or pass via CI/CD:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NODE_ENV=production
```

---

### Option 3: Docker Compose (Full Stack)

For local or staging environments with Supabase:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_SUPABASE_URL: ${SUPABASE_URL}
      NEXT_PUBLIC_SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY}
      NODE_ENV: production
```

Run:
```bash
docker-compose up
```

---

## State Management (Zustand)

### Flight Store

Manages:
- **Search Query** – origin, destination, date, passenger count
- **Selected Flight** – current flight selection
- **Selected Seat** – chosen seat with price
- **Passenger Form** – name, passport, nationality, DOB
- **Booking Step** – current step in booking flow

**Persisted to localStorage**, so users' progress is saved across sessions.

```typescript
import { useFlightStore } from '@/store/flight-store';

const { selectedFlight, selectedSeat, updatePassengerForm } = useFlightStore();
```

### User Store

Manages:
- **Authentication Session** – logged-in user JWT + metadata
- **User ID** – from Supabase Auth

---

## Real-time Features

### Seat Availability Updates

The `SeatMap` component subscribes to Supabase Realtime changes:

1. When a user books a seat, the database trigger fires
2. Supabase broadcasts `UPDATE` event for that seat
3. All connected clients receive the update via WebSocket
4. Seat UI refreshes with new availability status in real-time

**Channel subscription:**
```typescript
supabaseClient
  .channel(`public:seats:flight:${flightId}`)
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'seats',
    filter: `flight_id=eq.${flightId}`
  }, (payload) => {
    // Update local seat state
  })
  .subscribe();
```

---

## Security Considerations

### RLS (Row-Level Security)
- Booking data is accessible only to the user who created it
- Cancellation and rescheduling checked against user_id

### Validation
- Zod schemas validate all user inputs client-side and server-side
- Database constraints enforce data integrity

### Authentication
- Supabase Auth uses JWT tokens with secure storage
- Sessions auto-refresh with `autoRefreshToken: true`

### API Security
- CORS enabled for your domain
- Anon key is public; server operations use service role key when needed

---

## TypeScript Strict Mode

The project runs with **strict TypeScript** enabled:
- Type-safe database queries with custom `Database` interface
- RPC function argument/return typing
- Full component prop validation

**Type Definitions:**
- `lib/types/db.ts` – Database schema types (auto-generated from Supabase)
- `lib/validations/*.ts` – Zod validation schemas

---

## Troubleshooting

### Port 3000 Already in Use
```bash
# Linux/Mac
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Environment Variables Not Loading
1. Check `.env.local` exists in project root
2. Verify `NEXT_PUBLIC_` prefix (required for browser access)
3. Restart dev server: `npm run dev`

### Supabase Connection Errors
1. Verify URL and key in `.env.local`
2. Check Supabase project is not paused
3. Confirm CORS settings: **Project Settings** → **API** → **Allowed Origins**

### Realtime Not Updating
1. Ensure `supabaseClient` is initialized with correct URL/key
2. Check browser console for WebSocket errors
3. Verify RLS policies allow user access to seats table

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

---

## Performance Tips

1. **Image Optimization** – Use `next/image` for flight/airline logos
2. **Code Splitting** – App Router automatically code-splits pages
3. **Database Indexing** – Add indexes on `flights.origin`, `flights.destination`, `bookings.user_id`
4. **Caching** – Cache flight list with `SWR` or `React Query`
5. **PWA Caching** – Offline-first manifest with workbox

---

## Monitoring & Analytics

### Supabase Dashboard
- **API Activity** – Request volume, errors
- **Database Stats** – Connections, query performance
- **Auth Dashboard** – User signups, sessions

### Application Monitoring
Consider adding:
- **Vercel Analytics** – Page performance metrics
- **Sentry** – Error tracking
- **PostHog** – Product analytics

---
<h2>Lighthouse Audit</h2>
<img width="678" height="800" alt="image" src="https://github.com/user-attachments/assets/d76da854-d54a-4133-bb06-c5cbedc3cacd" />

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m "Add new feature"`
4. Push to branch: `git push origin feature/new-feature`
5. Open a Pull Request

---

## License

This project is licensed under the **MIT License** – see the LICENSE file for details.

---

## Support

For issues, questions, or suggestions:
1. **GitHub Issues** – Report bugs or request features
2. **Supabase Docs** – [supabase.com/docs](https://supabase.com/docs)
3. **Next.js Docs** – [nextjs.org](https://nextjs.org)

---

## Roadmap

- [ ] Payment integration (Stripe)
- [ ] Email notifications (SendGrid)
- [ ] SMS alerts for flight changes
- [ ] Loyalty program & miles
- [ ] Multi-passenger bookings
- [ ] Admin dashboard
- [ ] Analytics & reporting
- [ ] Mobile app (React Native)

---

**Built with ❤️ using Next.js, Supabase, and TypeScript**
