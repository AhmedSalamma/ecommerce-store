# E-Commerce Store

An e-commerce application with a React and Vite frontend and a Laravel API backend. It supports product and category browsing, shopping carts, customer accounts and orders, and an admin area for managing products, categories, and users.

## Repository Structure

| Directory | Description |
| --- | --- |
| `frontend/` | React interface, page navigation, client state, and API communication. |
| `backend/` | Laravel API, authentication, data and order management, and Stripe integration. |

## Requirements

- PHP 8.2 or later with the required Laravel extensions.
- Composer.
- Node.js and npm.
- MySQL, or another database engine configured for the backend.

## Local Development

### 1. Set Up the Backend

From the `backend/` directory:

```powershell
cd backend
composer install
Copy-Item .env.example .env
php artisan key:generate
```

Create a MySQL database named `ecomerce`, or update `DB_DATABASE` and the connection settings in `backend/.env` to match your setup. Then run the migrations:

```powershell
php artisan migrate
```

Start the backend server:

```powershell
php artisan serve
```

The default API base URL is `http://127.0.0.1:8000/api`.

### 2. Set Up the Frontend

In a separate terminal, from the `frontend/` directory:

```powershell
cd frontend
npm install
```

Create `frontend/.env` and add the API base URL:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Start the frontend development server:

```powershell
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

> If you change the frontend URL, update `FRONTEND_URL` in `backend/.env` to match the CORS configuration.

## Features

- Browse products, categories, and brands; search and filter the catalog.
- Register, sign in, and sign out using Laravel Sanctum.
- Manage the shopping cart, addresses, and orders, and complete checkout.
- Use the admin area to manage store statistics, products, categories, and users.
- Process payments with Stripe and receive payment events through a webhook.

API routes are prefixed with `/api`. Public routes include registration, login, products, categories, brands, and shipping prices. Account, cart, and order operations require authentication. Admin routes require an administrator account. See `backend/routes/api.php` for the complete route list.

## Tests and Checks

Run the backend tests from `backend/`:

```powershell
php artisan test
```

Lint the frontend and create a production build from `frontend/`:

```powershell
npm run lint
npm run build
```

## Payment Configuration

Stripe configuration is required to enable live payments. Add the Stripe secret keys and webhook settings to `backend/.env` using the variables defined in `backend/config/services.php`, then point Stripe to the webhook route defined in `backend/routes/api.php`. Never put secret keys in the frontend or commit them to Git.

## Development Notes

- Run the backend and frontend separately during development.
- Environment files (`.env`) are local; do not commit connection details or service keys.
- Additional setup notes are available in `backend/README.md` and `frontend/README.md`.
