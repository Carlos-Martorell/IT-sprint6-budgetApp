# 🚀 Budget Planning App (Angular 20 Standalone)

This application is a real-time tool for calculating web development budget estimates. It allows for the selection of services, immediate price calculation, and URL query parameter synchronization to easily share project configurations.

---

## Background & Philosophy

This project showcases a modern approach to building scalable Angular applications by leveraging the latest features of **Angular 20**.

The core philosophy focuses on:

* **Modern Angular:** Full adoption of **Standalone Components** and **Angular Signals** for simplified architecture and reactive state management.
* **Separation of Concerns:** Business logic is confined to services (`BudgetService`), while components focus purely on integration and presentation.
* **URL-Driven State:** The application state is synchronized with the URL, allowing configurations to be easily shared and persisted.

---

## Features

* ✅ Dynamic pricing based on service and configuration selection.
* ✅ Real-time cost calculation (total price signal).
* ✅ **Form-to-URL Synchronization** (bi-directional).
* ✅ Budget creation and client management.
* ✅ Budget search and sort functionality in the list view.
* ✅ **Full TypeScript** support for type safety.
* ✅ Responsive UI design with **Tailwind CSS**.

---

## Tech Stack

The project utilizes the following modern Angular 20 and related technologies:

* **Framework:** **Angular 20+**
* **Architecture:** Standalone Components, Angular Signals
* **Styling:** Tailwind CSS
* **Forms:** Angular Reactive Forms
* **Routing:** Angular Router, ActivatedRoute
* **Testing:** **Jasmine** and **Karma** (configured via `angular.json`)

---

## Getting Started

Ensure you have [Node.js](https://nodejs.org/en/download/) and npm installed.

1.  **Clone the repository:**
    ```bash
    git clone [YOUR-REPOSITORY-URL]
    cd presupuestos-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # Use --legacy-peer-deps only if version conflicts occur:
    # npm install --legacy-peer-deps
    ```

3.  **Run the application:**
    ```bash
    ng serve
    ```
    The app will be served at `http://localhost:4200/`.

---

## Testing Strategy

The project features a **comprehensive unit testing strategy** focused on isolating and validating core business logic.

### Test Coverage

Tests are categorized based on their role in the application:

* **Business Logic (`BudgetService`)**: Ensures correct price calculation and persistent data handling.
* **Infrastructure (`FormUrlSyncService`)**: Validates the bi-directional mapping between form data and URL query parameters.
* **Form Integration (`HomeComponent`)**: Tests the flow between form changes, service updates, and URL synchronization.
* **UI Logic (`BudgetsListComponent`)**: Covers all internal component logic, including filtering, sorting, and state management using Signals.

### Execution Commands

| Command | Description |
| :--- | :--- |
| `npm test` | Runs all tests in **watch mode** (re-runs on file changes). |
| `ng test --watch=false --browsers=ChromeHeadless` | Runs tests **once** in a headless browser (ideal for Continuous Integration/CI). |
| `ng test --code-coverage` | Runs tests and generates a detailed **coverage report** in the `coverage/` folder. |

