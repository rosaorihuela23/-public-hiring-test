# Carbon Emission Factors Application

A full-stack application for managing carbon emission factors, with a Node.js/Express backend and a Next.js frontend.

## Architecture

- **Backend**: Express, TypeScript, and [tsoa](https://tsoa-community.github.io/docs/) (OpenAPI + route generation) — listens on **`PORT` or `3000`**
- **Frontend**: Next.js 15 (App Router) with React 19 and TypeScript — `yarn dev` uses **Turbopack**; dev server defaults to port **3000** if that port is free
- **Database**: **PostgreSQL** with TypeORM (not SQLite). Containers are defined in `docker-compose.yml`; local connection settings come from **`back/.env`** (committed in this repo with development defaults)

## Getting Started

### Prerequisites

- **Node.js** 18 or newer (LTS recommended)
- **[Yarn](https://yarnpkg.com/)** 1.x (the repo pins a `packageManager` in each `package.json`)
- **Docker** and **Docker Compose** (to run PostgreSQL)

### Environment variables (backend)

**`back/.env`** is checked into the repository so you can run the stack without creating a file first. It contains **local development defaults only** (Postgres user/password and host ports). Edit it if your machine already uses ports **5432** / **5433**, or if you prefer different credentials. Do not deploy or reuse these values in production.

**`DATABASE_PASSWORD` must be non-empty** — the official Postgres image refuses to start otherwise, and the containers will restart in a loop while the app gets `ECONNREFUSED` on the configured port.

| Variable | Purpose |
|----------|---------|
| `DATABASE_USERNAME` | Postgres user |
| `DATABASE_PASSWORD` | Postgres password |
| `DATABASE_NAME` | Database name |
| `DATABASE_PORT` | Host port mapped to Postgres (must match the `ports` mapping in `docker-compose`) |
| `DATABASE_TEST_PORT` | Host port for the test database container (used when `NODE_ENV=test`) |

Optional:

- `PORT` — HTTP port for the API (default **3000**)
- `MIGRATIONS_RUN` — set to `true` if you want TypeORM to run migrations on startup (usually handled via scripts instead)

TypeORM connects to **localhost** using `DATABASE_PORT` / `DATABASE_TEST_PORT` as appropriate.

A **`back/.env.example`** file mirrors the same keys for documentation; prefer editing **`back/.env`** directly.

### Run the application

**1. Backend (start this first so the API uses port 3000)**

The frontend proxies API calls to `http://localhost:3000`, so the API should run on **3000** unless you change both the proxy and `PORT`.

```bash
cd back
yarn
yarn init-project
```

`init-project` builds the project, starts Postgres with Docker Compose, runs migrations, and seeds data.

Then start the API in development (watch mode + tsoa regeneration):

```bash
yarn dev
```

The server logs `http://localhost:<PORT>` (default **3000**).

**2. Frontend**

In another terminal:

```bash
cd front
yarn
yarn dev
```

Because the API should keep **3000**, start the backend before the frontend. If **3000** is already taken by the API, Next.js will offer the next free port (often **3001**). To fix the port explicitly:

```bash
yarn dev -- -p 3001
```

Open the URL Next.js prints (e.g. `http://localhost:3001`).

### Accessing the application

1. Open the frontend URL from the Next.js dev output in your browser.
2. The UI talks to the backend at **`http://localhost:3000`** (see `front/src/app/api/carbon-emission-factors/route.ts`).

## Features

- **View Carbon Emission Factors**: Browse all available carbon emission factors
- **Search & Filter**: Search through factors by name, unit, or source
- **Sortable Table**: Click column headers to sort data
- **Add New Factors**: Create new carbon emission factors via a modal form
- **Responsive Design**: Works on desktop and mobile devices

## API Endpoints

- `GET /carbon-emission-factors` — Retrieve all carbon emission factors
- `POST /carbon-emission-factors` — Create new carbon emission factors

## Development

### Backend

- Express app with tsoa-generated routes (`yarn tsoa:build` / `tsoa spec-and-routes`)
- TypeORM with PostgreSQL; migrations under `back/`
- Useful scripts in `back/package.json`: `dev`, `build`, `migration:run`, `migration:generate`, `seed`, `test`, `test:e2e`

### Frontend

- Next.js App Router (`front/src/app`)
- Tailwind CSS v4
- Component-based UI

## Troubleshooting

- **"Failed to fetch" / network errors**: Ensure the backend is running and reachable at **`http://localhost:3000`** (or the URL your frontend proxy uses).
- **Port conflicts**: The API defaults to **3000**. If something else uses **3000**, set `PORT` for the backend and update the frontend proxy to match.
- **Database errors**: Ensure Docker is running, `back/.env` matches `docker-compose` ports and credentials, and run `yarn init-project` or `yarn start-docker` plus migrations from `back/` as needed.




## Hiring Test

When working on the following exercise, in addition to meeting the product need, pay particular attention to:

- Readability
- Maintainability
- Unit testing
- Handling of corner cases
- Error handling

We want to compute the [Agribalyse](https://agribalyse.ademe.fr/) carbon footprint of a food product (for example, a `hamCheesePizza`) characterized by its ingredients, as shown below:

```js
const hamCheesePizza = {
  ingredients: [
    { name: "ham", quantity: 0.1, unit: "kg" },
    { name: "cheese", quantity: 0.15, unit: "kg" },
    { name: "tomato", quantity: 0.4, unit: "kg" },
    { name: "floor", quantity: 0.7, unit: "kg" },
    { name: "oliveOil", quantity: 0.3, unit: "kg" },
  ],
};
```

The [Agribalyse](https://agribalyse.ademe.fr/) carbon footprint calculation is defined as follows:

- The [Agribalyse](https://agribalyse.ademe.fr/) carbon footprint of one ingredient is obtained by multiplying the ingredient quantity by the emission value of a matching emission factor (same name and same unit).
- The carbon footprint of the food product is then obtained by summing the carbon footprint of all ingredients.
- If the carbon footprint of one ingredient cannot be calculated, then the carbon footprint of the whole product is set to null.

Tasks for this exercise:
1. Implement the product carbon footprint calculation and persist the result in the database.
2. Implement a `GET` endpoint to retrieve the result.
3. Implement a `POST` endpoint to trigger the calculation and save the result in the database.

## Frontend Task

Create a frontend that uses the endpoints you developed.

1. The user wants to calculate the carbon footprint of a product made of several ingredients and understand where the carbon emissions come from.
2. The user wants to save different products in order to compare their carbon footprints.
