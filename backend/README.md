# Hostel Project Backend (Phase 2)

This backend extends your existing frontend and enables production-ready live admin editing.

## 1) Install and run

```bash
cd backend
npm install
npm run dev
```

Health check:

```bash
GET http://localhost:5000/
```

Expected response:

```text
Hostel API running
```

## 2) MongoDB Atlas setup

1. Create account at MongoDB Atlas.
2. Create a new project and M0 free cluster.
3. Create database user (username/password).
4. In Network Access, allow your IP (or `0.0.0.0/0` temporarily for testing).
5. Click Connect -> Drivers -> Node.js and copy connection string.

Example:

```text
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/hostel_project?retryWrites=true&w=majority
```

Place in `.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=random_secret
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

Google APIs required for accurate distance routing:
- Geocoding API
- Distance Matrix API

## 3) Cloudinary setup

1. Create account at Cloudinary.
2. Open Dashboard and copy Cloud Name, API Key, API Secret.
3. Put these in `.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 4) Auth flow (replace hardcoded admin key)

Seed first admin (one-time):

```bash
curl -X POST http://localhost:5000/api/admin/seed \
  -H "Content-Type: application/json" \
  -d '{"name":"Owner Admin","email":"owner@example.com","password":"StrongPassword123"}'
```

Security note:
- `POST /api/admin/seed` is one-time only and blocked after first admin creation.
- In production, keep `ALLOW_ADMIN_SEED=false`.
- Temporarily set `ALLOW_ADMIN_SEED=true` only for initial bootstrap, then switch it back to `false`.

Login:

```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@example.com","password":"StrongPassword123"}'
```

Use returned JWT as `Authorization: Bearer <token>`.

## 5) Seed default hostels

```bash
npm run seed
```

Seeds:
- Sai Praneeth Boys Hostel 1
- Sai Praneeth Boys Hostel 2
- Elvy Stays

## 6) API routes

Public routes:
- `GET /api/hostels`
- `GET /api/hostels/:id`
- `GET /api/gallery`
- `POST /api/contact`
- `POST /api/distance/hostel`

Admin routes:
- `POST /api/admin/login`
- `POST /api/hostels`
- `PUT /api/hostels/:id`
- `POST /api/hostels/:id/restore`
- `POST /api/gallery`
- `DELETE /api/gallery/:id`

Distance endpoint request example:

```bash
curl -X POST http://localhost:5000/api/distance/hostel \
  -H "Content-Type: application/json" \
  -d '{"hostelKey":"praneeth1","userLocationText":"Railway Station Ooty"}'
```

Distance response shape:

```json
{
  "hostel": {
    "id": "...",
    "name": "Sai Praneeth Boys Hostel 1",
    "slug": "sai-praneeth-boys-hostel-1",
    "location": "Locality, City, State",
    "latitude": 11.4064,
    "longitude": 76.6932
  },
  "origin": {
    "input": "Railway Station Ooty",
    "formatted_address": "...",
    "latitude": 11.4,
    "longitude": 76.7
  },
  "route": {
    "distance_text": "3.2 km",
    "duration_text": "11 mins",
    "distance_km": 3.2,
    "duration_minutes": 11
  },
  "google_maps_url": "https://www.google.com/maps/search/?api=1&query=..."
}
```

## 7) Frontend integration examples

Replace localStorage read:

```js
const response = await fetch("http://localhost:5000/api/hostels");
const hostels = await response.json();
```

Send contact enquiry to backend first:

```js
await fetch("http://localhost:5000/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ hostel, name, phone, message })
});
```

Admin login and token storage:

```js
const loginRes = await fetch("http://localhost:5000/api/admin/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password })
});
const { token } = await loginRes.json();
localStorage.setItem("adminToken", token);
```

Protected admin update:

```js
await fetch(`http://localhost:5000/api/hostels/${id}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("adminToken")}`
  },
  body: JSON.stringify(payload)
});
```

Gallery image upload:

```js
const formData = new FormData();
formData.append("image", fileInput.files[0]);
formData.append("hostel_id", hostelId);

await fetch("http://localhost:5000/api/gallery", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("adminToken")}`
  },
  body: formData
});
```

## 8) Security and production

Already included:
- Helmet headers
- CORS policy
- Rate limiting
- JWT auth middleware
- Central error handler
- Audit logs
- Backup history in hostel updates (`history` snapshots)

## 9) Deployment plan

1. Push code to GitHub.
2. Deploy backend on Render or Railway.
3. Add backend env vars in host dashboard.
4. Deploy frontend on Netlify or Vercel.
5. Set frontend API base URL to deployed backend URL.
6. Test all public/admin endpoints and image upload.
