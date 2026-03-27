# ✨ MVP Frontend SPA

Welcome to my Single Page Application (SPA) for the MVP. This frontend is carefully crafted to deliver an exceptional, blazing-fast user experience using the Angular ecosystem.

## 🚀 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Angular** | `v21` | Core Framework, Reactivity, and Routing |
| **Tailwind CSS** | `v4` | Utility-first Styling Engine |
| **PrimeNG** | `v21` | Complex UI Accessible Component Library |
| **TypeScript** | `v5.x` | Strongly-typed JavaScript |

## 🏗 Architectural Choices & Trade-offs

### Modern Angular: Signals & Standalone Components
We fully embrace the "Modern Angular" paradigm to ensure a lightweight and performant application:
- **Standalone Components:** `NgModules` are a thing of the past. Our architecture relies entirely on Standalone Components, resulting in less boilerplate, easier lazy-loading, and highly tree-shakable code.
- **Signals for Reactivity:** We utilize Angular Signals for fine-grained, glitch-free DOM updates, shifting away from heavy reliance on Zone.js for UI refreshes.

### Design System: PrimeNG 21 + Tailwind CSS v4
Why combine a heavy component suite with a utility CSS framework?
- **PrimeNG 21** gives us battle-tested, highly accessible, and complex components out of the box (like DataTables, Calendars, and complex Overlays). This saves hundreds of hours of recreating the wheel.
- **Tailwind CSS v4** provides a blazing-fast, customized utility engine. We use it to layout the application, handle macro/micro-styling, and effectively customize/theme our PrimeNG components.
- **Trade-off:** While PrimeNG adds to the overall bundle footprint, v21's modularity ensures we only import precisely what we use. The resulting boost in developer velocity and UI consistency is an indispensable advantage.

### Single Source of Truth: Signals vs. RxJS
For state management and UI reactivity, **Signals** are our designated "Single Source of Truth." They provide synchronous, entirely predictable state readings directly to the template.
- **Trade-off:** We do not entirely abandon **RxJS**. Instead, we strictly reserve RxJS for handling asynchronous data streams, complex event handling, and HTTP requests. We convert these streams to Signals at the system boundaries using `toSignal()`. This dramatically lowers the cognitive load by eliminating the need to manage complex subscription lifecycles in our templates.

### Clean Architecture in the Frontend
Our frontend file structure maps to Clean Architecture principles to keep components dumb and services smart:
- **Core/Domain:** Interfaces, global types, and state management.
- **Infrastructure/Services:** API clients, HTTP Interceptors, and environment logic. Reusable services that fetch and shape data map perfectly to application "repositories".
- **Features/Pages:** Smart components representing distinct application routable views.
- **UI/Shared:** Dumb, highly reusable presentational components that rely exclusively on `@Input()` and `@Output()`.

By separating API services from presentation logic, we ensure our components remain fully testable and concerned only with UI rendering.

## 🛠 How to Run

1. **Install Dependencies:**
   ```bash
   npm install
   ```
2. **Start Development Server:**
   ```bash
   npm run start
   # or
   ng serve
   ```
3. **View the Application:**
   Navigate to `http://localhost:4200/` in your browser. The application will automatically reload if you change any of the source files.