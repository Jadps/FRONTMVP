# MVP Frontend

Frontend SPA for the MVP system.

Built with Angular and kept deliberately simple: components handle UI, services handle data, and shared code stays reusable.

## Badges

![Angular](https://img.shields.io/badge/Angular-21-DD0031?style=flat&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![PrimeNG](https://img.shields.io/badge/PrimeNG-UI-00C853?style=flat)
![License](https://img.shields.io/github/license/Jadps/BACKMVP?style=flat)

## Structure

- **core/**  
  Shared types, global state, and app-wide contracts.

- **services/**  
  API calls, data access, and response shaping.

- **features/**  
  Route-based pages with application logic.

- **shared/**  
  Reusable UI components.

## Design choices

- Standalone components instead of NgModules
- Signals for local and shared state
- RxJS only where async streams make sense
- PrimeNG for complex UI
- Tailwind for layout and styling

## Getting started

### Prerequisites

- Node.js
- npm

### Setup

1. Install dependencies:

   ```bash
   npm install