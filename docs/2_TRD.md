# Technical Requirements Document (TRD)

## 1. System Architecture
ZenHabit utilizes a modern, serverless, offline-first architecture. The client application handles local state and storage, synchronizing with a backend-as-a-service (BaaS) for data persistence and authentication.

## 2. Technology Stack
- **Frontend Framework**: React Native (v0.85+)
- **Build Tool / SDK**: Expo (v56+)
- **State Management**: Zustand
- **Local Storage**: `react-native-mmkv` (high-performance synchronous storage)
- **Backend / Database**: Supabase (PostgreSQL, Supabase Auth)
- **Date Utility**: `date-fns`
- **Icons**: `lucide-react-native`

## 3. Data Flow & State Management
- **Optimistic UI**: All user interactions (e.g., checking off a habit) instantly update the Zustand local state and MMKV storage.
- **Background Sync**: After the local update, an asynchronous call is made to the Supabase backend to replicate the change in the cloud.
- **Cloud to Local**: On app launch or authentication state change, the app fetches the latest cloud data and reconciles it with the local state.

## 4. Integration Points
- **Supabase Auth**: Handles user registration, login, and session management.
- **Supabase Realtime / REST**: Manages CRUD operations for `profiles`, `habits`, and `habit_completions`.
- **Home Screen Widgets**: Integrates with native iOS/Android widget APIs (`react-native-home-widget`) via Deep Links (`zenHabitWidget://checkoff/:id`).

## 5. Security & Authentication
- All cloud data access is gated by Supabase Auth tokens.
- PostgreSQL Row Level Security (RLS) ensures users can only read, update, or delete their own rows in the database.
- Local data is stored securely using MMKV.

## 6. Performance Constraints
- State updates must resolve in < 16ms to maintain 60fps animations.
- Local storage (MMKV) reads/writes must be synchronous to avoid loading spinners during app use.
