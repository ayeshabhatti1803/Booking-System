# Hotel Booking & Management System

A full-stack hotel booking system with a guest-facing booking site and an admin panel.

## Project Structure

```
server/   Express + TypeScript + Prisma (SQLite) API
client/   Guest-facing booking site (React + Vite + TypeScript), runs on http://localhost:5173
admin/    Admin panel (React + Vite + TypeScript), runs on http://localhost:5174
```

## Prerequisites
- Node.js 18+

## First-time setup

```powershell
# 1. Server
cd server
npm install
npx prisma migrate dev   # creates the SQLite database
npm run seed              # creates a default admin user + sample hotel/room data
npm run dev                # starts API on http://localhost:4000

# 2. Guest site (in a new terminal)
cd client
npm install
npm run dev                # http://localhost:5173

# 3. Admin panel (in a new terminal)
cd admin
npm install
npm run dev                # http://localhost:5174
```

## Default admin login
- Username: `admin`
- Password: `admin123`

Change these in production by editing `server/src/seed.ts` before seeding, or updating the `Admin` record directly.

## Environment variables (server/.env)
- `DATABASE_URL` — SQLite file path
- `PORT` — API port (default 4000)
- `SESSION_SECRET` — secret used to sign admin session cookies (change in production)
- `CLIENT_ORIGIN` / `ADMIN_ORIGIN` — allowed CORS origins for the two front-ends

## Features
See [product-requirements.md](product-requirements.md) for the full feature list. Implemented in this build:
- Guest: browse hotel info, search room availability by date/guests, book a room, receive a booking code + secure "manage booking" link, view/cancel booking.
- Admin: session-based login, dashboard stats, room type CRUD, booking management (search/filter, manual booking creation, cancel, mark completed), hotel content editing.

## Notes on this build
- Payments are out of scope for v1 (pay-at-hotel model).
- Emails are not sent; the booking code/manage link is returned directly by the API and shown on the confirmation page.
- Availability is enforced server-side by checking overlapping confirmed bookings against each room type's total inventory.
