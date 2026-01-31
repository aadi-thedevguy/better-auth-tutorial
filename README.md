# better-auth-tutorial

A minimal NextJS template with better auth and all it's essential plugins

## Development

clone this repo, then run the below commands

```sh
npm install
```
Replace .env.example with .env and fill in the values.

Start Local Database:

```sh
docker-compose up -d
```

Generate Prisma Client Types:

```sh
npm run db:generate

```

Start dev server:

```sh
pnpm dev
```

#### Other Available Scripts

- `pnpm db:push`: Push schema changes to database
- `pnpm db:studio`: Open database studio UI