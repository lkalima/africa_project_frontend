# /src/components

This directory contains all shared, reusable React components for the frontend application.

## Naming Convention

- Components are written in PascalCase (e.g., `PayloadImage.tsx`).
- Each component should ideally live in its own folder for better organization, especially if it has related files (like CSS modules or helper functions).

## Current Components

- **/RichText/serialize.tsx**: A server-side utility function that safely converts Payload's Lexical JSON structure into renderable React/JSX elements. This is the core of our rich text rendering.
- **/PayloadImage.tsx**: A dedicated client-side component for rendering images served from the Payload backend. It uses a custom `loader` function to handle image URLs correctly and bypasses Next.js `remotePatterns` configuration issues.