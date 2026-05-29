# UI/UX Design Document

## 1. Design Philosophy
ZenHabit follows a minimalist, distraction-free design philosophy. The interface is designed to be calm, accessible, and highly responsive. Micro-interactions and smooth transitions are used to provide immediate feedback to the user.

## 2. Color Palette & Theming
The app supports dynamic theming (Light and Dark modes).
- **Backgrounds**: Soft, neutral colors (e.g., `#F9FAFB` for light, `#121212` for dark).
- **Primary Accents**: Calming colors to indicate positive actions (e.g., Teals, soft Greens).
- **Destructive/Break Accents**: Subdued reds or oranges for negative habits.
- **Text**: High contrast for readability, using standard native typography.

## 3. Typography
- Utilizes native system fonts (San Francisco on iOS, Roboto on Android) for familiarity and optimal performance.
- Clear hierarchy: Large headers for dates and primary sections, medium text for habit names, small text for tags and stats.

## 4. Key UI Components
### 4.1. Bottom Tab Bar
- Minimalist navigation bar with clear icons for Home, Stats, and Settings.
- Central, prominent "+" FAB (Floating Action Button) for adding new habits quickly.

### 4.2. Habit Card
- Displays habit icon, name, and current streak.
- Interactive: Tapping toggles completion status with a satisfying visual response.
- Swipeable: Swipe actions reveal edit or delete options.

### 4.3. Bottom Sheets & Modals
- `BottomSheet.js` / `PopupSheet.js`: Used for non-intrusive interactions like adding a habit, selecting icons, or viewing detailed stats without completely leaving the current context.

## 5. User Experience (UX) Flows
- **Frictionless Entry**: The time from opening the app to checking off a habit should be less than 2 seconds.
- **Visual Feedback**: Immediate visual changes (color shifts, icon updates) when a habit is completed to provide a dopamine hit.
- **Error Handling**: Non-blocking toast notifications or popup sheets for errors (e.g., sync failures), ensuring the user is not locked out of local usage.
