# Swiggy AI — Craving Identifier & Smart Pickup

> **A concept demo pitching two next-generation features for Swiggy's platform — an AI-powered Food Advisor that identifies what you're craving before you know it yourself, and a "Ready on Arrival" Pickup mode that syncs your travel with food prep in real time.**

---
## Demo Video And Deployment

<p align="center">
  <a href="https://youtube.com/shorts/dxfYgse9StI?feature=share">
    <img src="https://img.shields.io/badge/Watch%20Demo-1E90FF?style=for-the-badge&logo=youtube&logoColor=white&labelColor=000000" />
  </a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://swiggy-ai-craving-identifier-j41x.vercel.app/">
    <img src="https://img.shields.io/badge/Live%20Deployment-1E90FF?style=for-the-badge&logo=vercel&logoColor=white&labelColor=000000" />
  </a>
</p>
---

## The Problem This Solves

| Pain Point | Current Swiggy Experience | This Feature |
|---|---|---|
| **Decision fatigue** | Users scroll endlessly without knowing what they want | AI asks 3 smart questions and surfaces a craving profile |
| **Pickup inefficiency** | No sync between when you arrive and when food is ready | ETA-matched kitchen start times — food is ready when you walk in |
| **Cold food on pickup** | You wait at the restaurant or food waits for you | Dual real-time tracking keeps both in sync |

---

## Features

### 1. AI Food Advisor (`/food-advisor`)
An intelligent, conversational recommendation engine that identifies what you're *actually* craving.

- **Smart question flow** — Asks 3 targeted questions (mood, cuisine preference, hunger level)
- **Craving profile detection** — Maps answers to a psychological craving archetype (Comfort Seeker, Explorer, etc.)
- **Confidence-scored recommendations** — Shows matched dishes with a match % so users trust the pick
- **Zero scroll fatigue** — Goes from "I don't know what I want" to an order in under 60 seconds

> **Product Insight:** Decision fatigue is one of the top reasons users abandon the app without ordering. This feature converts browsers into buyers.

---

### 2. Smart Pickup — "Ready on Arrival" (`/pickup`)
A pickup experience designed around *your* schedule, not the restaurant's.

- **Travel mode selection** — Walking, Bike, or Car/Auto with realistic ETA calculation
- **Smart kitchen sync** — Restaurant kitchen starts prep based on your live ETA
- **Dual progress tracking** — See your travel progress and food prep progress side by side in real time
- **Pickup code system** — Secure, contactless handoff with a one-time code
- **No more waiting** — Food is hot and ready the moment you walk in

> **Product Insight:** Pickup orders have near-zero delivery cost for Swiggy. Improving the pickup UX drives higher-margin orders and increases restaurant partner satisfaction.

---

### 3. Redesigned Home (`/`)

- Location-aware header with dynamic offers
- Food category navigation optimised for craving-first browsing
- "New Features" showcase section for in-app discovery
- Restaurant chain carousels + smart sorting

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.4 (App Router) |
| UI Library | React 19 |
| Styling | Tailwind CSS 4 |
| Icons | React Icons |
| Language | TypeScript |

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/amgaikwad4588/swiggy-ai-craving-identifier.git
cd swiggy-ai-craving-identifier

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

```bash
# Build for production
npm run build
npm start
```

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                # Home page
│   ├── pickup/
│   │   └── page.tsx            # Smart Pickup feature
│   ├── food-advisor/
│   │   └── page.tsx            # AI Food Advisor
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
└── components/
    ├── Header.tsx
    ├── BottomNav.tsx
    ├── PromoBanner.tsx
    ├── SearchBar.tsx
    ├── FoodCategories.tsx
    ├── NewFeatures.tsx
    ├── TopRestaurantChains.tsx
    └── RestaurantList.tsx
```

---

## Why This Matters for Swiggy

### Business Impact Potential

**AI Food Advisor**
- Reduces session abandonment from decision fatigue
- Increases average order value by surfacing premium recommendations
- Collects rich taste-preference data to power personalisation at scale

**Smart Pickup**
- Pickup = near-zero delivery cost → higher margin per order
- Better kitchen utilization for restaurant partners
- Differentiates Swiggy from competitors who treat pickup as an afterthought
- Reduces wait-time complaints → improves restaurant ratings

### User Experience Impact
- Converts "I'll order later" moments into completed orders
- Builds habit loops through a delightful, game-like recommendation experience
- Reduces the average time-to-order for repeat users

---

## Roadmap / What's Next

- [ ] Integrate real Swiggy restaurant & menu APIs
- [ ] ML model trained on real order history for craving detection
- [ ] Live GPS tracking integration for pickup ETA
- [ ] Push notification: "Start heading over — your food will be ready in 8 mins"
- [ ] Group ordering mode for the Food Advisor (each person answers → one combined cart)
- [ ] Voice-first craving identification ("Hey Swiggy, I'm hungry")

---

## About

Built as a product concept demo to explore how AI and smarter UX flows can meaningfully improve Swiggy's core ordering experience.

**Open to feedback, collaboration, and conversations with the Swiggy product team.**

---

> *This is a concept/demo project and is not affiliated with or endorsed by Swiggy.*
