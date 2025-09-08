# Event Management System - Backend (MERN)

Backend API for the Event Management System. Implements authentication (JWT), events CRUD, registrations, contact messages, and dashboard stats. CSV export for event registrations included.

## Tech
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Auth (users & admin roles)
- express-validator, helmet, cors, morgan

## Quick Start

1. **Clone & Install**
```bash
cd backend
npm install
```

2. **Configure Environment**
Create `.env` from `.env.example`:
```
PORT=5000
MONGO_URI=<your MongoDB Atlas URI>
JWT_SECRET=<a strong secret>

```

3. **Seed Admin**
```bash
npm run seed
```

4. **Run Dev**
```bash
npm run dev
```

## API Summary

### Auth
- `POST /api/auth/register` { name, email, password }
- `POST /api/auth/login` { email, password }
- `GET /api/auth/me` (Bearer token)

### Events (Public + Admin)
- `GET /api/events` query: `page, limit, category, dateFrom, dateTo, q`
- `GET /api/events/:id`
- `POST /api/events` (admin) body: { title, description, category, location, date, price?, imageUrl? }
- `PUT /api/events/:id` (admin)
- `DELETE /api/events/:id` (admin)

### Registrations
- `POST /api/registrations` (user) body: { eventId }
- `GET /api/registrations/me` (user)
- `GET /api/registrations/event/:id` (admin)
- `GET /api/registrations/event/:id/export` (admin) -> CSV download

### Messages (Contact)
- `POST /api/messages` { name, email, message }
- `GET /api/messages` (admin)

### Dashboard (Admin)
- `GET /api/dashboard/overview` -> { totalEvents, totalRegistrations, latestMessages }

## Project Structure
```
/backend
  /config
  /controllers
  /middleware
  /models
  /routes
  /seed
  /utils
```

## Notes
- Image uploads are handled as `imageUrl` (provide hosted URL). You can later integrate uploads (S3/Cloudinary).
- Indexes: `email` unique (User), `category` & `date` (Event), and compound unique (Registration user+event).
- Secure your `JWT_SECRET` and CORS origins for production.
```

