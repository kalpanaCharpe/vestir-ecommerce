# VESTIR — E-Commerce Frontend

A modern, luxury fashion e-commerce frontend built with **React + Vite**, connecting to a Node.js/Express/MongoDB backend.

## Tech Stack

- **React 18** + **Vite**
- **React Router v6** — client-side routing
- **Axios** — API calls with JWT interceptors
- **TailwindCSS** — utility-first styling
- **Framer Motion** — animations
- **React Hot Toast** — toast notifications
- **React Icons** — icon library

## Design System

- **Brand**: VESTIR — luxury, refined, obsidian + gold palette
- **Fonts**: Playfair Display (headings), DM Sans (body), DM Mono (labels/numbers)
- **Colors**: Obsidian scale, Gold accent, Cream background

## Pages

| Route | Description | Auth |
|-------|-------------|------|
| `/` | Home with featured products | Public |
| `/products` | Product listing with search/filter/pagination | Public |
| `/products/:id` | Product detail + add to cart | Public |
| `/cart` | Cart management | Login required |
| `/checkout` | Place order | Login required |
| `/orders` | Order history | Login required |
| `/profile` | View/edit user profile | Login required |
| `/admin` | Admin dashboard | Admin only |
| `/login` | Sign in | Guest only |
| `/register` | Create account | Guest only |

## Getting Started

### 1. Install dependencies

```bash
cd ecommerce-frontend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env and set your backend URL:
# VITE_API_URL=http://localhost:5000/api
```

### 3. Start development server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

## API Integration

All API calls are in `src/api/index.js`. The base URL is configured via `VITE_API_URL`.

JWT tokens are stored in `localStorage` and automatically attached to every request via an Axios interceptor. On 401 responses, the user is logged out and redirected to `/login`.

## Project Structure

```
src/
├── api/
│   ├── axios.js        # Axios instance + interceptors
│   └── index.js        # All API functions
├── components/
│   ├── common/
│   │   ├── Loading.jsx       # Spinner, SkeletonCard, EmptyState
│   │   ├── Pagination.jsx    # Pagination component
│   │   ├── ProductCard.jsx   # Product card with hover effects
│   │   └── RouteGuards.jsx   # ProtectedRoute, AdminRoute, GuestRoute
│   └── layout/
│       ├── Layout.jsx    # Main layout wrapper
│       ├── Navbar.jsx    # Responsive navbar with user menu
│       └── Footer.jsx    # Footer with links
├── context/
│   ├── AuthContext.jsx   # Auth state + login/logout/register
│   └── CartContext.jsx   # Cart state + CRUD operations
├── pages/
│   ├── HomePage.jsx
│   ├── ProductsPage.jsx
│   ├── ProductDetailPage.jsx
│   ├── CartPage.jsx
│   ├── CheckoutPage.jsx
│   ├── OrdersPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── ProfilePage.jsx
│   ├── AdminDashboard.jsx
│   └── NotFoundPage.jsx
├── App.jsx             # Root with routing
├── main.jsx            # Entry point
└── index.css           # Global styles + Tailwind
```

## Admin Dashboard Features

- **Products**: List, create, edit, delete products with image upload
- **Orders**: View all orders, update order status (pending/processing/shipped/delivered/cancelled)
- **Users**: View all users, delete users

To access the admin dashboard, your user account must have `role: "admin"` in the database.
