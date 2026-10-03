# 1Fi EMI Store

A full-stack smartphone shopping application built for the 1Fi SDE1
assignment. The application allows users to browse smartphones, view
product details, select variants and EMI plans, add products to a cart,
and preview an order.

## Table of Contents

-   [Overview](#overview)
-   [Features](#features)
-   [Tech Stack](#tech-stack)
-   [Project Structure](#project-structure)
-   [Application Architecture](#application-architecture)
-   [Prerequisites](#prerequisites)
-   [Frontend and Backend Setup](#frontend-and-backend-setup)
-   [Environment Variables](#environment-variables)
-   [Database Setup and Seeding](#database-setup-and-seeding)
-   [Running the Application](#running-the-application)
-   [API Documentation](#api-documentation)
-   [Database Schema](#database-schema)
-   [Seed Data](#seed-data)
-   [Frontend Routes](#frontend-routes)
-   [Cart Management](#cart-management)
-   [Application Flow](#application-flow)
-   [Error Handling](#error-handling)
-   [Limitations](#limitations)
-   [Future Improvements](#future-improvements)
-   [Available Scripts](#available-scripts)
-   [Author](#author)
-   [License](#license)

------------------------------------------------------------------------

## Overview

1Fi EMI Store is a smartphone e-commerce application with EMI-based
purchasing.

The application is divided into two parts:

-   **Frontend:** React + Vite
-   **Backend:** Node.js + Express.js
-   **Database:** MongoDB using Mongoose

Product information, variants, and EMI plans are stored in MongoDB and
accessed through REST APIs provided by the Express backend.

The shopping cart is maintained on the frontend using browser
`localStorage`.

The order preview API validates the selected product, variant, and EMI
plan before the user proceeds further. It does not create a real order
or process a payment.

------------------------------------------------------------------------

## Features

### Product Listing

-   Display smartphones dynamically from MongoDB.
-   Show product name, price, MRP, discount, variants, and EMI
    availability.
-   Navigate from the product listing to individual product pages.

### Product Details

-   View complete product information.
-   Select storage/color variants.
-   View available EMI plans.
-   Select an EMI plan.
-   Add the selected configuration to the cart.

### EMI Plans

Each product can contain multiple EMI plans with:

-   Monthly payment
-   Tenure in months
-   Interest rate
-   Cashback

### Shopping Cart

-   Add selected products to cart.
-   Store selected variant and EMI plan.
-   Update quantity.
-   Remove products.
-   Persist cart data using `localStorage`.
-   Calculate cart totals.

### Order Preview

Before proceeding, the frontend sends the selected product, variant, and
EMI plan to the backend.

The backend validates the selections and returns an order preview.

### Responsive UI

The frontend is designed to work across desktop and mobile screen sizes.

------------------------------------------------------------------------

## Tech Stack

### Frontend

-   React
-   Vite
-   React Router DOM
-   JavaScript
-   CSS Modules / CSS

### Backend

-   Node.js
-   Express.js
-   Mongoose
-   dotenv
-   CORS

### Database

-   MongoDB
-   MongoDB Atlas supported

### Development Tools

-   npm
-   Git
-   GitHub
-   VS Code

------------------------------------------------------------------------

## Project Structure

``` text
1fi-sde1-mongodb/
│
├── backend/
│   ├── models/
│   │   └── Product.js
│   ├── server.js
│   ├── seed.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.module.css
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md
```

------------------------------------------------------------------------

## Application Architecture

``` text
                  ┌──────────────────────┐
                  │    React + Vite      │
                  │      Frontend        │
                  │   localhost:5173     │
                  └──────────┬───────────┘
                             │
                             │ REST API / HTTP
                             ▼
                  ┌──────────────────────┐
                  │   Node.js + Express  │
                  │       Backend        │
                  │   localhost:5000     │
                  └──────────┬───────────┘
                             │
                             │ Mongoose
                             ▼
                  ┌──────────────────────┐
                  │       MongoDB        │
                  │ Product / EMI Data   │
                  └──────────────────────┘
```

------------------------------------------------------------------------

# Prerequisites

Before running the project, install the following:

-   Node.js 18+ recommended
-   npm
-   MongoDB or a MongoDB Atlas account
-   Git
-   A code editor such as VS Code

Check Node.js and npm:

``` bash
node --version
npm --version
```

------------------------------------------------------------------------

# Frontend and Backend Setup

This project has two separate applications. The backend and frontend
must be installed and run separately.

## 1. Clone the Repository

``` bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd 1fi-sde1-mongodb
```

The repository contains:

``` text
1fi-sde1-mongodb/
├── backend/
└── frontend/
```

------------------------------------------------------------------------

# Backend Setup

The backend is responsible for:

-   Connecting to MongoDB
-   Serving product data
-   Validating product selections
-   Providing order preview functionality
-   Handling REST API requests

## Step 1: Open the Backend Folder

``` bash
cd backend
```

## Step 2: Install Backend Dependencies

``` bash
npm install
```

## Step 3: Create Backend Environment File

Create:

``` text
backend/.env
```

Add:

``` env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
FRONTEND_URL=http://localhost:5173
```

Example MongoDB Atlas configuration:

``` env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/1fi-emi-store?retryWrites=true&w=majority
PORT=5000
FRONTEND_URL=http://localhost:5173
```

Replace the placeholder values with your actual MongoDB credentials.

### Important

Do not commit `.env` to GitHub.

Add the following to `.gitignore`:

``` text
.env
node_modules/
```

## Step 4: Seed the Database

Run:

``` bash
npm run seed
```

This clears the existing demo product records and inserts the sample
smartphone data.

## Step 5: Start the Backend

Development mode:

``` bash
npm run dev
```

Or normal mode:

``` bash
npm start
```

The backend runs on:

``` text
http://localhost:5000
```

Health check:

``` text
http://localhost:5000/api/health
```

------------------------------------------------------------------------

# Frontend Setup

The frontend is responsible for:

-   Product listing
-   Product details
-   Variant selection
-   EMI plan selection
-   Shopping cart
-   Order preview interaction

## Step 1: Open a New Terminal

Keep the backend running.

From the project root:

``` bash
cd frontend
```

## Step 2: Install Frontend Dependencies

``` bash
npm install
```

## Step 3: Create Frontend Environment File

Create:

``` text
frontend/.env
```

Add:

``` env
VITE_API_URL=http://localhost:5000/api
```

This tells the React application where the backend API is running.

## Step 4: Start the Frontend

``` bash
npm run dev
```

Vite will normally start the frontend at:

``` text
http://localhost:5173
```

Open that address in your browser.

------------------------------------------------------------------------

# Environment Variables

## Backend `.env`

``` env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### Variables

  -------------------------------------------------------------------------
  Variable                Description             Example
  ----------------------- ----------------------- -------------------------
  `MONGODB_URI`           MongoDB connection      `mongodb+srv://...`
                          string                  

  `PORT`                  Backend server port     `5000`

  `FRONTEND_URL`          Frontend URL used for   `http://localhost:5173`
                          CORS                    
  -------------------------------------------------------------------------

## Frontend `.env`

``` env
VITE_API_URL=http://localhost:5000/api
```

### Variable

  -----------------------------------------------------------------------------
  Variable                Description             Example
  ----------------------- ----------------------- -----------------------------
  `VITE_API_URL`          Base URL of the backend `http://localhost:5000/api`
                          API                     

  -----------------------------------------------------------------------------

------------------------------------------------------------------------

# Database Setup and Seeding

The application uses MongoDB for product data.

## MongoDB Atlas

For MongoDB Atlas:

1.  Create a MongoDB Atlas cluster.
2.  Create a database user.
3.  Configure Network Access.
4.  Copy the MongoDB connection string.
5.  Add it to `backend/.env`.

Example:

``` env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/1fi-emi-store
```

## Seed the Database

From the `backend` directory:

``` bash
npm run seed
```

The seed script inserts three demo products:

-   iPhone 17 Pro
-   Samsung S24 Ultra
-   OnePlus 13

------------------------------------------------------------------------

# Running the Application

The frontend and backend should run in two separate terminals.

## Terminal 1 --- Backend

``` bash
cd backend
npm install
npm run seed
npm run dev
```

Backend:

``` text
http://localhost:5000
```

## Terminal 2 --- Frontend

``` bash
cd frontend
npm install
npm run dev
```

Frontend:

``` text
http://localhost:5173
```

Open:

``` text
http://localhost:5173
```

------------------------------------------------------------------------

# Quick Start

If all environment variables are already configured:

### Backend

``` bash
cd backend
npm install
npm run seed
npm run dev
```

### Frontend

Open another terminal:

``` bash
cd frontend
npm install
npm run dev
```

Then open:

``` text
http://localhost:5173
```

------------------------------------------------------------------------

# API Documentation

The backend exposes the following REST APIs.

## 1. Health Check

### Request

``` http
GET /api/health
```

### Purpose

Checks whether the backend server is running and provides database
connection status.

------------------------------------------------------------------------

## 2. Get All Products

### Request

``` http
GET /api/products
```

### Purpose

Returns all available smartphone products.

### Example

``` json
[
  {
    "_id": "product_id",
    "name": "iPhone 17 Pro",
    "slug": "iphone-17-pro",
    "description": "Premium smartphone",
    "mrp": 134900,
    "price": 127400,
    "variants": [],
    "emiPlans": []
  }
]
```

------------------------------------------------------------------------

## 3. Get Product by Slug

### Request

``` http
GET /api/products/:slug
```

### Example

``` http
GET /api/products/iphone-17-pro
```

### Purpose

Returns the details of one product using its slug.

------------------------------------------------------------------------

## 4. Preview Order

### Request

``` http
POST /api/orders/preview
```

### Request Body

``` json
{
  "productSlug": "iphone-17-pro",
  "variantId": "variant_id",
  "emiPlanId": "emi_plan_id"
}
```

### Purpose

Validates:

-   Product
-   Selected variant
-   Selected EMI plan

and returns the order preview.

This endpoint does not create a permanent order or process a payment.

------------------------------------------------------------------------

# Database Schema

## Product Schema

``` text
Product
├── _id
├── name
├── slug
├── description
├── mrp
├── price
├── variants[]
└── emiPlans[]
```

## Variant Schema

``` text
Variant
├── _id
├── type
├── value
├── color
└── imageUrl
```

Example:

``` json
{
  "type": "Storage",
  "value": "256GB",
  "color": "Orange",
  "imageUrl": "..."
}
```

## EMI Plan Schema

``` text
EMI Plan
├── _id
├── monthlyPayment
├── tenureMonths
├── interestRate
└── cashback
```

Example:

``` json
{
  "monthlyPayment": 4500,
  "tenureMonths": 36,
  "interestRate": 0,
  "cashback": 2000
}
```

------------------------------------------------------------------------

# Seed Data

The seed script currently contains three demo smartphones.

## iPhone 17 Pro

-   Price: ₹127,400
-   MRP: ₹134,900
-   Variants:
    -   256GB Orange
    -   512GB Silver
    -   1TB Blue
-   EMI tenures:
    -   3 months
    -   6 months
    -   12 months
    -   24 months
    -   36 months
    -   48 months
    -   60 months

## Samsung S24 Ultra

-   Price: ₹109,999
-   MRP: ₹129,999
-   Variants:
    -   256GB Black
    -   512GB Titanium
    -   1TB Gray
-   EMI tenures:
    -   3 months
    -   6 months
    -   12 months
    -   24 months
    -   36 months

## OnePlus 13

-   Price: ₹74,999
-   MRP: ₹84,999
-   Variants:
    -   256GB Black
    -   512GB Blue
    -   1TB Green
-   EMI tenures:
    -   3 months
    -   6 months
    -   12 months
    -   24 months
    -   36 months

------------------------------------------------------------------------

# Frontend Routes

  Route               Description
  ------------------- ----------------------
  `/`                 Product listing page
  `/products/:slug`   Product details page
  `/cart`             Shopping cart

Examples:

``` text
/
```

``` text
/products/iphone-17-pro
```

``` text
/cart
```

------------------------------------------------------------------------

# Cart Management

The cart is managed on the client side.

Cart data is stored in browser `localStorage` using:

``` text
1fi-cart
```

Each cart item contains the selected product configuration, including
the selected variant and EMI plan.

Because the cart is stored in `localStorage`:

-   The cart persists after page refresh.
-   No cart collection is currently stored in MongoDB.
-   Clearing browser storage clears the local cart.

------------------------------------------------------------------------

# Application Flow

``` text
User opens application
        │
        ▼
React loads product listing
        │
        ▼
Frontend calls GET /api/products
        │
        ▼
Express Backend
        │
        ▼
MongoDB
        │
        ▼
Products returned to React
        │
        ▼
User opens product
        │
        ▼
Selects variant + EMI plan
        │
        ▼
Adds product to cart
        │
        ▼
Cart stored in localStorage
        │
        ▼
User proceeds to order preview
        │
        ▼
POST /api/orders/preview
        │
        ▼
Backend validates selections
        │
        ▼
Order preview returned
```

------------------------------------------------------------------------

# Error Handling

The backend validates requests and returns appropriate HTTP responses
for common errors such as:

-   Product not found
-   Invalid product slug
-   Invalid variant
-   Invalid EMI plan
-   Invalid request body
-   Database connection problems

The frontend displays appropriate error or loading states when API
requests fail.

------------------------------------------------------------------------

# Common Setup Issues

## MongoDB Connection Error

Check:

``` env
MONGODB_URI=your_mongodb_connection_string
```

For MongoDB Atlas, also verify:

-   MongoDB username
-   MongoDB password
-   Cluster URL
-   Database user permissions
-   Network Access / IP allowlist

## Frontend Cannot Connect to Backend

Make sure the backend is running:

``` text
http://localhost:5000
```

Check:

``` env
VITE_API_URL=http://localhost:5000/api
```

After changing `.env`, restart Vite:

``` bash
npm run dev
```

## No Products Are Displayed

Run the seed script:

``` bash
cd backend
npm run seed
```

Then restart the backend:

``` bash
npm run dev
```

## Port Already in Use

If port `5000` is occupied, change:

``` env
PORT=5001
```

Then update:

``` env
VITE_API_URL=http://localhost:5001/api
```

Restart both applications.

------------------------------------------------------------------------

# Production Build

To create a production build:

``` bash
cd frontend
npm run build
```

The production files will be generated in:

``` text
frontend/dist/
```

To preview the production build:

``` bash
npm run preview
```

------------------------------------------------------------------------

# Available Scripts

## Backend

From `backend/`:

``` bash
npm run dev
```

Starts the backend in development mode.

``` bash
npm start
```

Starts the backend normally.

``` bash
npm run seed
```

Seeds the MongoDB database with demo products.

## Frontend

From `frontend/`:

``` bash
npm run dev
```

Starts the Vite development server.

``` bash
npm run build
```

Creates the production build.

``` bash
npm run preview
```

Previews the production build locally.

------------------------------------------------------------------------

# Security Notes

-   Never commit MongoDB credentials.
-   Keep `.env` files out of version control.
-   Use environment variables for secrets and deployment-specific
    configuration.
-   Do not expose database credentials in frontend code.
-   The frontend communicates with MongoDB only through the backend API.

------------------------------------------------------------------------

# Limitations

This project is an assignment/demo implementation and currently does not
include:

-   User authentication
-   Persistent user accounts
-   Persistent server-side cart
-   Real payment gateway
-   Real order creation
-   Payment processing
-   Order history
-   Inventory management
-   Production-grade authentication/authorization

The `/api/orders/preview` endpoint is only for validating the selected
product configuration and generating a preview.

------------------------------------------------------------------------

# Future Improvements

Possible future enhancements include:

-   User authentication with JWT
-   Persistent cart per user
-   Order creation and order history
-   Payment gateway integration
-   Inventory management
-   Admin dashboard
-   Product search and filtering
-   Product reviews and ratings
-   Wishlist
-   Coupon management
-   Better validation and API error handling
-   Automated tests
-   Docker support
-   Production deployment

------------------------------------------------------------------------

# Development Workflow

``` text
1. Start MongoDB / MongoDB Atlas
          ↓
2. Start backend
   npm run dev
          ↓
3. Start frontend
   npm run dev
          ↓
4. Open http://localhost:5173
          ↓
5. Browse products
          ↓
6. Select variant and EMI plan
          ↓
7. Add product to cart
          ↓
8. Preview order
```

------------------------------------------------------------------------

# Author

**Samit Sankhla**

1Fi SDE1 MongoDB Assignment

------------------------------------------------------------------------

# License

This project was created for educational and assignment purposes.
