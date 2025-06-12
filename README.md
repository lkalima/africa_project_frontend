# Africa Project - Frontend

This repository contains the frontend application for the Africa Project, built with Next.js and React. It fetches data from the [Africa Project Backend API](https://github.com/lkalima/africa-project-backend) and renders the user-facing website.

---

## 🚀 Getting Started

Follow these instructions to get the frontend running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version, `nvm` recommended)
- [Git](https://git-scm.com/)
- A running instance of the [Africa Project Backend](https://github.com/lkalima/africa-project-backend) on `http://localhost:3000`.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/lkalima/african-voices-frontend.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd african-voices-frontend
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
5.  Open [http://localhost:3001](http://localhost:3001) with your browser to see the result. The backend API must be running on `localhost:3000` for the data fetching to work.

---

## 📁 Project Structure

This project uses the Next.js App Router. Here is an overview of the key files and folders:

*   **/src/app/**: This is the core of the application. All pages, layouts, and components live here.
    *   **/src/app/layout.tsx**: The root layout that wraps all pages.
    *   **/src/app/page.tsx**: The homepage of the website.
    *   **/src/app/instruments/**: A route group for all instrument-related pages.
        *   **/src/app/instruments/page.tsx**: The main list page that displays all musical instruments.
        *   **/src/app/instruments/[slug]/page.tsx**: The dynamic detail page for a single musical instrument. The `[slug]` is a parameter that corresponds to the instrument's unique slug.
*   **/public/**: Contains static assets that are served directly, such as images, fonts, and favicons.
*   **next.config.js**: The main configuration file for Next.js.
*   **tsconfig.json**: The configuration file for TypeScript.

---

## 📚 Learn More & Documentation

For a full overview of the project's vision, architecture, data models, and workflows, please refer to the comprehensive **[Project Blueprint](https://github.com/lkalima/africa-project-backend/blob/main/README.md)** located in the backend repository.