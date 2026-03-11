# RouteOptimizer – Frontend (React + Vite)

A **React + Vite** frontend for a courier/logistics route optimization system.  
It includes **role-based authentication**, **admin tools** for managing couriers and orders, and **Google Maps** features (places autocomplete + live courier map).

---

## What This Project Does

RouteOptimizer is designed for courier companies to improve delivery operations by:

- optimizing delivery routes,
- improving allocation of deliveries across couriers,
- tracking courier/user locations,
- enabling admins to create and distribute orders efficiently.

This repository contains the **frontend** (UI + API integration).

---

## Key Features (Implemented)

### Authentication & Authorization
- Login using backend API (`/backend/login`)
- JWT stored in `localStorage`
- **Role-based routing**:
  - `admin` pages (e.g. manage users, create orders)
  - `user` pages (e.g. user dashboard)
- Session expiration check (auto logout when token expires)

### Admin Features
- **Create new delivery orders**
  - Uses **Google Places Autocomplete** for sender & recipient addresses
  - Submits to backend (`/backend/create`)
- **Manage users/couriers**
  - Fetch users from backend (`/backend/users`)
  - View courier locations on a **Google Map** (markers + dark theme)
  - Set courier status: `available` / `unavailable`
  - Delete users
- **Assign orders to couriers**
  - Fetch order clustering/assignment data (`/backend/orders`)
  - Assigns clusters to available couriers via backend request

### User Features
- User landing/dashboard page
- **Live geolocation tracking**
  - Periodically sends current location to backend (`/backend/users/location`)

---

## Tech Stack

- **React (React Router)**
- **Vite**
- **TailwindCSS**
- **Axios**
- **Google Maps APIs**
  - `@react-google-maps/api`
  - `react-google-places-autocomplete`

---

## Getting Started (Local Development)

### 1) Go to the app folder
Your React app lives in:

```bash
cd frontendReact
```

### 2) Install dependencies
```bash
npm install
```

### 3) Create `.env`
Create a file: `frontendReact/.env`

```bash
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_API_KEY=YOUR_GOOGLE_MAPS_KEY
```

### 4) Run the dev server
```bash
npm run dev
```

Vite is configured with `--host`, so it will be reachable on your LAN as well.

---

## Routes / Pages (High-Level)

- `/` → Sign In
- `/user-home` → User home (protected: user)
- `/admin-home` → Admin home (protected: admin)
- `/manage-users` → Admin user/courier management (protected: admin)
- `/create-order` → Create a new order (protected: admin)
- `/signup` → Create user/admin (protected: admin)
- `/orders`, `/profile` → user protected pages (WIP / lightweight currently)

---

## Backend Integration

This frontend expects a backend exposing endpoints like:

- `POST /backend/login`
- `POST /backend/signup`
- `GET /backend/users`
- `POST /backend/users/location`
- `PUT /backend/users/:id/status`
- `DELETE /backend/users/:id`
- `GET /backend/orders`
- `PUT /backend/users/:id/ordersasaign`
- `POST /backend/create`

---

## Notes / Improvements (Next Steps)

- Add frontend tests (Vitest + React Testing Library)
- Better error UI (toast notifications, API error boundaries)
- Improve token handling (refresh tokens or centralized auth provider)
- Improve `/orders` and `/profile` pages (currently minimal)

---

## Author

**Borimir Ganchev**  
GitHub: https://github.com/BorimirGanchev