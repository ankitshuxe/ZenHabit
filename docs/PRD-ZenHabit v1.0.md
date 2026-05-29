# Product Requirements Document PRD-ZenHabit v1.0

### 1. Product Overview

**ZenHabit** is a minimalist, cross-platform mobile application designed to help users build positive habits and break negative ones. In a crowded market of overly gamified and bloated tracking apps, ZenHabit differentiates itself through a hyper-fast, offline-first architecture that removes all friction from logging daily routines.

### 2. Problem Statement

Current habit trackers often suffer from feature bloat, aggressive monetization screens, and reliance on constant internet connectivity, which introduces latency. Users seeking to build discipline need an app that gets out of their way, opens instantly, and works flawlessly regardless of network conditions.

### 3. Target Audience & Personas

- **Primary Audience:** Productivity-conscious individuals looking to improve personal discipline without the overhead of complex project management tools.
  
-  **Persona A (The Optimizer):** Sarah, 28, wants to drink more water and read for 20 minutes daily. She values clean UI, dark mode, and quick widgets so she doesn't get distracted by opening her phone.

- **Persona B (The Commuter):** David, 34, wants to break his habit of biting his nails. He often tracks his habits while on the subway (low/no connectivity) and needs reliable offline tracking that syncs later.

### 4. Success Metrics (KPIs for V1)

- **Acquisition:** 1,000 App Store/Play Store downloads in the first two month.
- **Activation:** 70% of new users create at least one habit within their first session.
- **Retention:** 40% Day-7 (D7) retention rate.
- **Engagement:** Average of 2.5 app sessions per Daily Active User (DAU).
  
### 5. Scope & Features (V1)
#### 5.1. Core Habit Management

- **Creation & Categorization:** Create, edit, and archive habits. Tag as "Build" (Positive) or "Break" (Negative).
- **Frequency Logic:** Support for daily habits, and specific weekdays (e.g., Mon/Wed/Fri).
- **Daily Check-ins:** One-tap toggle for habit completion.
#### 5.2. Notifications & Nudges

- **Local Push Notifications:** Configurable daily reminders for specific habits (e.g., "Read 10 pages" at 8:00 PM).
#### 5.3. Streaks & Analytics

- **Visual Progress:** Display current streak, all-time best streak, and total completions.
- **Calendar View:** A simple month-view visual map showing days a specific habit was completed.
#### 5.4. Accounts, Sync & Architecture

- **Authentication:** Email/Password and Social Login (Apple/Google) via Supabase Auth.
- **Guest Mode:** fully functional local-only mode with a prompt to "Sign up to backup your data."
- **Offline-First Sync:** Data writes to a local database (e.g., SQLite/WatermelonDB) first, updating the UI instantly (Optimistic UI), and syncs to Supabase in the background when a connection is available.

#### 5.5. UI/UX

- **Theming:** System-default light/dark mode support.
- **Home Screen Widgets:** iOS and Android widgets for viewing daily remaining habits and logging them without launching the app.
  
### 6. User Stories (Agile Mapping)

-  _As a new user,_ I want to use the app immediately without creating an account, so I can test its value before handing over my email.
- _As a user,_ I want to mark a habit as complete even when in airplane mode, so my streak isn't broken by a lack of internet.
- _As a user,_ I want to see a visual calendar of my past month, so I feel motivated by my consistency.
- _As a user,_ I want to receive a notification at a specific time, so I don't forget to do my daily meditation.

### 7. Non-Functional Requirements (NFRs)

- **Performance:** App Time-to-Interactive (TTI) must be under 1.5 seconds. State updates must be instantaneous (<50ms response to tap).
- **Security:** Database structured with strict Row Level Security (RLS) in Supabase ensuring users can only read/write their own `user_id` rows.
- **Technology Stack:** React Native (Expo) for frontend; Supabase (PostgreSQL) for backend/auth.
- **Accessibility (a11y):** All interactive elements must have minimum touch targets of 44x44pt. Support for native screen readers (VoiceOver/TalkBack).
- **Data Privacy:** Users must have a one-click option in settings to "Delete Account and All Associated Data."

### 8. Out of Scope (Future Roadmap for V2+)

To ensure a fast time-to-market, the following features are excluded from V1:

- Social sharing or "friends" leaderboards.
- Advanced habit metrics (e.g., time-tracking or numeric inputs like "drank 3 glasses of water").
- Wearable integration (Apple Watch / WearOS).
- Premium monetization features (V1 will act as a free growth phase).