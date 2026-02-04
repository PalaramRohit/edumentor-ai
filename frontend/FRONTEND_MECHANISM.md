# EduMentor AI - Frontend Codebase Deep Dive

This document provides a detailed, file-by-file explanation of the frontend architecture. Use this to understand how the User Interface is built.

---

## 1. Core Setup (`/src`)

### `main.tsx` (The Bootloader)
This is the very first file that runs.
-   It finds the `<div id="root">` in the HTML file.
-   It "mounts" the React application (`<App />`) inside that div.
-   It wraps the app in global providers (like `QueryClientProvider` for data fetching).

### `App.tsx` (The Router)
This file acts as the Traffic Cop. It decides which page to show based on the URL.
-   **`BrowserRouter`**: Enables navigation without page reloads.
-   **`Routes`**:
    -   path `/` -> Shows `DashboardContent`.
    -   path `/roadmap` -> Shows `Roadmap`.
    -   path `/analysis` -> Shows `Analysis`.
    -   path `/profile` -> Shows `Profile`.
-   **`AppShell` Wrapper**: Notice how all routes are inside `<Route element={<AppShell />}>`. This ensures the Sidebar and Chat Panel are visible on *every* page.

### `index.css` (The Styling)
-   Contains the **Global Styles**.
-   Defines the "variable colors" (like `--primary`, `--background`) that make up the Dark Theme.
-   Includes utility classes for the "Glassmorphism" look (e.g., `.glass-card`).

---

## 2. Infrastructure (`/src/lib`)

### `lib/api.ts` (The Bridge)
**CRITICAL FILE.** This is the *only* file that talks to the Backend.
-   It acts as a library of functions. Instead of writing `fetch('http://localhost:5000/...')` inside every component, we just call `api.getUser()`.
-   **`getUser(id)`**: Calls GET `/users`.
-   **`runAnalysis(id, role)`**: Calls POST `/analysis/run`.
-   **`generateRoadmap(...)`**: Calls POST `/roadmap/generate`.
-   **`chat(message)`**: Calls POST `/explain/chat`.

---

## 3. Layout Components (`/src/components/layout`)

### `AppShell.tsx`
The main frame of the application.
-   Uses CSS Grid to divide the screen into 3 columns:
    1.  **Sidebar** (Navigation).
    2.  **Outlet** (The dynamic content - changes when you click links).
    3.  **AIMentorPanel** (The chat).

### `Sidebar.tsx`
The left-hand navigation menu.
-   Contains links (`NavLink`) to Dashboard, Roadmap, etc.
-   Handles the "Active State" (highlighting the button for the page you are currently on).

---

## 4. Feature Components (`/src/components`)

### `mentor/AIMentorPanel.tsx` (The Chatbot)
The right-hand panel.
-   **State**: Keeps track of the `messages` array (conversation history).
-   **`handleSend()`**:
    -   Takes user input.
    -   Adds it to the message list.
    -   Calls `api.chat(input)` to get the AI's answer.
    -   Adds the AI's answer to the message list.

### `dashboard/WelcomeCard.tsx`
The big card at the top of the Dashboard.
-   **`localStorage`**: It checks if your user details are saved in the browser. If not, it creates a "Demo User" (Rohit).
-   Displays the **Readiness Gauge** component.

### `dashboard/ReadinessGauge.tsx`
A pure visual component.
-   Takes a `percentage` (0-100) as a prop.
-   Draws a colorful SVG circle based on that number.

---

## 5. Pages (`/src/pages`)
These are the main screens of the app.

### `DashboardContent.tsx` (Home)
-   Aggregates the `WelcomeCard` and other quick stats.
-   Acts as the landing page.

### `Syllabus.tsx` (Input)
-   Contains a large `<textarea>` for pasting syllabus text.
-   **Logic**: When you click "Analyze", it calls the backend API to extract skills and show them as "Chips".

### `Analysis.tsx` (Visualization)
-   **Logic**:
    -   Calls `api.runAnalysis()`.
    -   Receives: `readiness_pct`, `missing_skills` (list), `weak_skills` (list).
-   **Display**:
    -   Shows the Score Gauge.
    -   Lists "Missing Skills" in Red cards.
    -   Lists "Weak Skills" in Yellow cards.

### `Roadmap.tsx` (The Plan)
-   **Inputs**:
    -   User can add "Focus Skills" (e.g., "I want to learn Docker").
    -   User selects "Hours per Week" using a slider.
-   **Logic**: Calls `api.generateRoadmap()`.
-   **Display**:
    -   Receives a JSON object with "Weeks".
    -   Loops through the weeks (`roadmap.weeks.map(...)`) and renders a card for each week with its topics and tasks.

### `Profile.tsx` (Identity)
-   Reads user data from `localStorage`.
-   Displays static info (Name, Email, Degree) and career goals.
-   This is where we will add the "Edit Profile" feature later.
