# LUXE — Frontend

Premium luxury eCommerce storefront and admin panel built with **Next.js**, **TypeScript**, and **Material UI**.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | Material UI (MUI) v9 |
| Styling | MUI + Tailwind CSS v4 |
| State | Zustand (auth, cart, wishlist) |
| Data Fetching | TanStack Query v5 |
| HTTP Client | Axios |
| Forms | React Hook Form + Zod |
| Animations | Framer Motion |
| Carousel | Swiper.js |
| Notifications | Notistack |
| Images | next/image + ImageKit CDN |

## Project Structure

```
frontend/
├── app/
│   ├── (store)/         # Shop: home, products, cart, checkout, account
│   ├── (auth)/          # Login, register, forgot password
│   └── admin/           # Admin dashboard & CRUD pages
├── components/
│   ├── home/            # Hero, featured, categories, gallery
│   ├── layout/          # Header, footer, cart drawer
│   ├── product/         # Product cards
│   └── admin/           # Product form, admin guard
├── lib/
│   ├── api/             # Axios API modules
│   ├── store/           # Zustand stores
│   └── utils/           # Media URL helpers
└── types/               # TypeScript interfaces
```

## Features

### Storefront
- Animated hero (ImageKit banners from API)
- Product listing with filters, sort, search, pagination
- Product detail: gallery, zoom, variants, reviews, buy now
- Category pages, cart drawer, checkout (COD + coupons)
- User account: profile, orders, addresses, wishlist

### Admin Panel
- Dashboard analytics
- Products, categories, orders, customers
- Coupons, banners, review moderation
- Image upload → ImageKit via backend API

## Prerequisites

- Node.js 20+
- Running LUXE backend API

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
   NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_public_key
   NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Routes

| Area | Routes |
|------|--------|
| Shop | `/`, `/products`, `/products/[slug]`, `/category/[slug]`, `/checkout` |
| Auth | `/login`, `/register`, `/forgot-password`, `/reset-password` |
| Account | `/account`, `/account/orders`, `/account/wishlist`, … |
| Admin | `/admin`, `/admin/products`, `/admin/categories`, … |
| Content | `/about`, `/faq`, `/contact`, `/shipping`, `/privacy`, … |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
| `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` | ImageKit public key (display) |
| `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` | ImageKit CDN endpoint |

> **Never commit `.env.local` to Git.** It is listed in `.gitignore`.

## Docker

From project root:
```bash
docker compose up frontend --build
```

## License

MIT
