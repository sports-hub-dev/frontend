# Sports Hub — Frontend

Production React frontend for Sports Hub, an Egyptian e-commerce platform selling uniforms and PPE to
delivery/logistics workers — including DSP (Delivery Service Partner) vendor employees such as Amazon Egypt staff.

## Getting Started

```bash
npm install
cp .env.example .env   # then fill in your API URL, Stripe key, and Paymob iframe ID
npm start
```

The app expects the backend described in `sportshub-backend-v4` running at the URL configured in
`REACT_APP_API_URL` (defaults to `http://localhost:5000/api/v1`).

## Environment Variables

| Variable | Description |
|---|---|
| `REACT_APP_API_URL` | Base URL for the Sports Hub API |
| `REACT_APP_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (test or live) |
| `REACT_APP_PAYMOB_IFRAME_ID` | Paymob iframe ID (used server-side; kept here for reference) |

## Registering as a DSP / Vendor User

Go to **Register → Register as a DSP vendor user** (`/register/vendor`). The vendor/DSP dropdown is populated
live from `GET /vendors/active`, so any vendor company the backend admin has approved and activated — Amazon
Egypt or any future DSP — appears automatically, with no frontend code changes required. New vendor-user
accounts are locked until a Sports Hub admin approves them from **Admin → Users → Pending Vendor Users**.

## Project Structure

```
src/
├── api/            # One file per backend resource, thin axios wrappers
├── app/            # Redux store, authSlice (silent refresh), cartSlice (localStorage)
├── components/     # ui / layout / product / order / cart / payment / admin
├── constants/      # Route paths, order status labels & colors
├── hooks/          # useAuth, useCart, usePagination, useReveal
├── layouts/        # PublicLayout, CustomerLayout, AdminLayout
├── pages/          # public / customer / admin
├── routes/         # ProtectedRoute, AdminRoute guards
└── utils/          # formatPrice, formatDate, cn, validation schemas
```

## Brand

- **Colors:** Deep navy `#10192C` (primary), amber `#F2A93B` (accent), plus safety green/red for stock and status states.
- **Type:** Space Grotesk (display), Inter (body), IBM Plex Mono (order numbers, tracking codes, prices).
- **Motif:** A "dispatch manifest" visual language — dashed dividers, stamp-style status badges, monospace tracking
  codes — reflecting the logistics/delivery nature of the business.

## Notes

- Prices are always rendered via `formatPrice()` (e.g. `1,250 EGP`) — never as raw numbers.
- The cart is entirely client-side (Redux + localStorage); there is no cart API.
- Payment errors never lose the order: the same Stripe `clientSecret` / Paymob `iframeUrl` stays available so the
  customer can retry with a different card without recreating the order.
