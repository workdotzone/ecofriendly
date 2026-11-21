This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Admin account setup

Before creating the first admin, set these server-only variables in `.env`:

- `JWT_SECRET`: a random secret with at least 32 characters. Keep it private; changing it invalidates existing sessions.
- `ADMIN_SETUP_KEY`: a separate random secret with at least 32 characters. It is required only for the one-time initial registration.

Generate each value separately with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Restart the app, open `/admin/login`, and create the first admin using the setup key, email, and a password of at least 12 characters. Registration closes as soon as the account is created. Complete this setup from a trusted device before making the site publicly accessible. After registration, the setup key can be removed; keep `JWT_SECRET` configured for login sessions.

Admin sessions use an HTTP-only cookie and expire after 12 hours. Admin APIs require a valid session, and repeated failed login attempts are temporarily rate-limited.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
