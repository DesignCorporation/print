# Print Design Corp — Project Documentation

**URL:** https://print.designcorp.eu
**Status:** MVP V1.0 (Production Ready)
**Tech Stack:** Next.js 14, Tailwind CSS, Prisma (SQLite), NextAuth.js, Stripe.

---

## ✅ Completed Features

### 1. Infrastructure
- Project initialized on port `3003`.
- Nginx with SSL (`print.designcorp.eu`).
- Database: SQLite (`dev.db`) with full schema (User, Product, Order, Invoice).

### 2. Public Storefront
- **Home:** Hero banner, Categories grid.
- **Catalog:** `/products` (Mock data structure ready for DB sync).
- **Configurator:** `/products/[category]/[slug]` with real-time price calculation.
- **Cart:** `/cart` (Zustand + localStorage).

### 3. E-commerce Core
- **Checkout:** `/checkout` form (Contact, Shipping, Company Data).
- **Orders:** `createOrder` Server Action saving to DB.
- **Payments:** **Stripe Integration (Live Mode)**.
  - Redirect to Stripe Checkout.
  - Webhook listener (`/api/webhooks/stripe`) updates Order status to `PAID`.

### 4. User Account & Auth
- **Auth:** NextAuth.js (Email/Password).
- **Register/Login:** `/register` & `/login`.
- **Dashboard:** `/account` (Order history, Status tracking).

### 5. Admin Panel
- **Access:** Protected route `/admin` (Role-based access).
- **Orders:** List of all orders (`/admin/orders`).
- **Management:** Order details & Status updates (In Production, Shipped, Completed).

---

## 🛠 Database Schema
Key models in `prisma/schema.prisma`:
- **User**: Role (`CUSTOMER`, `ADMIN`).
- **Order**: Status flow (`PENDING_PAYMENT` -> `PAID` -> `IN_PRODUCTION` -> `SHIPPED`).
- **Address**: Shipping/Billing details.

---

## 🚀 Future Roadmap (V2)
- **Invoices:** PDF generation using `react-pdf` or `puppeteer`.
- **File Upload:** S3 integration for artwork uploads in Configurator.
- **Email Notifications:** Send transactional emails (Order Confirmation, Status Change) via SMTP/Resend.
- **PostgreSQL Migration:** Move from SQLite to Postgres for production scaling.
