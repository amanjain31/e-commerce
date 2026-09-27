# Client (React + Redux Toolkit + React Router + Tailwind)

## Setup

```bash
npm install
```

Create a `.env` file (already included with a default) with:

```
VITE_API_BASE_URL=http://localhost:8000/api
```

Run dev server:

```bash
npm run dev
```

## Folder structure

```
src/
├── api/            # axios instance + backend call functions
├── redux/          # slices + store
├── components/     # Navbar, Layout, ProtectedRoute, ProductCard
├── pages/          # Register, Login, Products, ProductDetail, AddProduct, EditProduct
├── router/         # createBrowserRouter config (Data Mode)
├── App.jsx
└── main.jsx
```

## Deploying to Railway

1. Push this `client` folder (and the `server` folder) to a single GitHub repo.
2. Create two Railway services from the same repo:
   - **Backend service** — Root directory: `server`
     - Build command: `npm install`
     - Start command: `npm run dev` (or `node src/server.js`)
     - Environment variables: `PORT`, `MONGO_URI` (MongoDB Atlas, not localhost), `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `CLIENT_URL` (set this to the frontend's Railway URL once it's live)
   - **Frontend service** — Root directory: `client`
     - Build command: `npm install && npm run build`
     - Start command: `npm start` (serves the `dist` folder via `serve`)
     - Environment variables: `VITE_API_BASE_URL` = `<backend-railway-url>/api`
3. Backend cookie settings: in `auth.controller.js`, change `sameSite: "strict"` to `sameSite: "none"` (and keep `secure: true`) wherever `res.cookie(...)` / `res.clearCookie(...)` is used for `refreshToken`, since frontend and backend will be on different Railway domains (cross-site).
4. Use a MongoDB Atlas connection string in production (a `localhost` Mongo instance won't be reachable from Railway).
