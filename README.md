This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## WhatsApp Lead Setup

This project now includes:

- a product-page WhatsApp CTA that opens a pre-filled message with product details
- a Meta WhatsApp Cloud API webhook at `/api/whatsapp/webhook`
- lead storage in Sanity using the `whatsappLead` document type

### 1. Configure environment variables

Copy `.env.example` to `.env.local` and set:

- `SANITY_API_WRITE_TOKEN`: a Sanity token with write access to create `whatsappLead` documents
- `WHATSAPP_WEBHOOK_VERIFY_TOKEN`: any long random string you choose
- `WHATSAPP_APP_SECRET`: your Meta app secret used to validate `x-hub-signature-256`

You also need the existing public Sanity variables already used by the site.

### 2. Configure Sanity content

- In `Site Settings`, set `siteUrl` to your public website URL so the WhatsApp message includes the product page link.
- In `Site Settings -> Organization`, set `whatsappNumber`.
- Optionally customize each product's WhatsApp message template. Supported placeholders are `{{title}}`, `{{category}}`, `{{brand}}`, `{{code}}`, `{{slug}}`, `{{url}}`, `{{consent}}`, and `{{consentValue}}`.

### 3. Configure the Meta webhook

- In your Meta app, add the WhatsApp product and use your public HTTPS callback URL: `https://your-domain.com/api/whatsapp/webhook`
- Use the same value from `WHATSAPP_WEBHOOK_VERIFY_TOKEN` as the webhook verify token
- Subscribe the webhook to the `messages` field for your WhatsApp Business Account
- Make sure your app secret matches `WHATSAPP_APP_SECRET`

For local testing, expose your Next.js app through a public HTTPS tunnel such as `ngrok http 3000`, then use the tunnel URL as the callback URL.

### 4. Consent behavior

The default pre-filled message includes:

`Future WhatsApp updates consent: No`

That means:

- the customer has initiated a conversation, so replying to that enquiry is captured as a customer-initiated interaction
- future outreach consent is only marked as granted if the customer changes that line to `Yes` before sending

Consent rules vary by region and use case, so review your exact workflow with legal/compliance counsel before using stored leads for promotions.
