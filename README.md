# RetailLite

Retail shop management app built with React (Vite), Express, and Netlify Database (PostgreSQL).

## Run it locally

Use Node.js 24 and the Netlify CLI. From the repository root:

```sh
npm run install:all
netlify db migrations apply
npm run dev
```

Open `http://localhost:8889` for the frontend and API together.

## Deploy and store data

Netlify publishes the Vite frontend, runs the Express API on Netlify Server, and applies the committed PostgreSQL migrations. Products and sales persist in Netlify Database; no MongoDB connection is required. The new database starts empty and does not import records from a standalone MongoDB installation.

For schema changes, edit `db/schema.ts`, then generate and commit a migration using `npx drizzle-kit generate --name <change_name>`.

## Structure
```
client/          React and Vite frontend
server/          Express API and retail workflows
db/              Drizzle database schema and client
netlify/server/  Netlify Server entry point
```

## API
| Method | Route | Purpose |
|---|---|---|
| GET | /api/dashboard | totals + 5 recent sales |
| GET / POST | /api/products | list (supports ?q=) / add |
| DELETE | /api/products/:id | delete |
| GET / POST | /api/sales | history / record sale |

A sale and its stock deduction are saved in a single transaction. Sales retain the original product name and unit price even if the product is later deleted.
