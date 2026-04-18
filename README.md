# Swiggy Feature Demo

A Next.js 16 web application showcasing innovative food delivery features inspired by Swiggy.

## Features

### 1. Home Page (`/`)
- Header with location selector and user menu
- Promo banner with current offers
- Search bar for restaurants and dishes
- Food category navigation
- New features showcase
- Top restaurant chains carousel
- Restaurant list with ratings and delivery time
- Bottom navigation bar

### 2. Pickup Feature (`/pickup`)
- "Ready on Arrival" pickup service
- Travel mode selection (Walking, Bike, Car/Auto)
- Smart ETA-based restaurant matching
- Restaurant menu with add-to-cart
- Real-time dual tracking (your travel + food prep progress)
- Order confirmation with pickup code

### 3. Food Advisor (`/food-advisor`)
- AI-powered food recommendation system
- Smart question flow to understand cravings
- Craving profile detection
- Matched food recommendations with confidence scores

## Tech Stack

- **Framework**: Next.js 16.2.4 (App Router)
- **UI**: React 19, Tailwind CSS 4
- **Icons**: React Icons
- **Language**: TypeScript

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── page.tsx           # Home page
│   ├── pickup/page.tsx    # Pickup feature
│   ├── food-advisor/page.tsx  # Food advisor
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
└── components/
    ├── Header.tsx
    ├── BottomNav.tsx
    ├── PromoBanner.tsx
    ├── SearchBar.tsx
    ├── FoodCategories.tsx
    ├── NewFeatures.tsx
    ├── TopRestaurantChains.tsx
    └── RestaurantList.tsx
```# swiggy-ai-craving-identifier
