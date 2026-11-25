# RetailLite (MERN)

Retail shop management app rebuilt with **MongoDB, Express, React (Vite) and Node.js**.

## Run it (PowerShell, from this folder)

```powershell
npm run install:all     # installs root, server and client dependencies
npm run seed            # optional: loads 5 sample products
npm run dev             # starts API (5000) + React app (5173)
```

Open http://localhost:5173

## Database
Edit `server/.env` (already created from `.env.example`):
- Local MongoDB: `MONGO_URI=mongodb://127.0.0.1:27017/retail_shop_db`
- MongoDB Atlas: paste your `mongodb+srv://...` connection string.

## Structure
```
server/   Express API  (models, routes, config, seed.js)
client/   React + Vite (pages, components, api.js)
```

## API
| Method | Route | Purpose |
|---|---|---|
| GET | /api/dashboard | totals + 5 recent sales |
| GET / POST | /api/products | list (supports ?q=) / add |
| DELETE | /api/products/:id | delete |
| GET / POST | /api/sales | history / record sale |

## PHP to MERN mapping
| Old | New |
|---|---|
| index.php pages | React pages + React Router |
| actions/*.php | Express routes |
| MySQL tables | Mongoose models (sale items embedded in Sale) |
| DB transaction on sale | Atomic `findOneAndUpdate` with `quantity >= qty` guard |
| assets/app.js search | React state filter |
