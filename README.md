# Restaurant OS

A full-stack restaurant management system designed to streamline the ordering process through QR codes and provide a robust admin panel for restaurant owners.

## Key Features

### Customer Interface
- QR Code Scanning: Customers can scan a table-specific QR code to access the digital menu.
- Digital Menu: Browse menu items categorized by type (e.g., Starters, Main Course).
- Dietary Filters: Filter items by Veg, Non-Veg, Jain, and Chef's Special.
- Real-time Cart: Add/remove items and view order summary before placing an order.
- Order Confirmation: Receive immediate feedback once an order is placed.

### Admin Panel
- Order Management: Real-time dashboard to view, update status (Pending, Preparing, Completed, Cancelled), and clear orders.
- Menu Management: Add, edit, or delete menu items. Supports image uploads for each dish.
- Bulk Upload: Import menu items quickly using CSV files.
- QR Code Generation: Generate and manage unique QR codes for each table in the restaurant.
- Customization: Personalize the restaurant's digital presence by changing themes, colors, and fonts (e.g., Inter font integration).
- Bill Export: Generate and export bills in PNG format for record-keeping.

## What Has Been Done

### Backend Development (Django & DRF)
- Implemented a robust REST API using Django Rest Framework.
- Designed database models for Restaurants, Staff, Menu Categories, Menu Items, Tables, and Orders.
- Integrated JWT-based authentication for secure admin access.
- Developed utility functions for QR code generation and CSV parsing.
- Set up media handling for menu item images and generated QR codes.

### Frontend Development (React & Vite)
- Built a responsive and modern UI using React and Tailwind CSS.
- Implemented state management for the shopping cart and order flow.
- Created a comprehensive Admin Dashboard with dedicated pages for Orders, Menu, QR Management, and Settings.
- Integrated "Inter" font globally for a premium look and feel.
- Developed a dynamic bill rendering system that exports to PNG.

### Integration & Styling
- Connected the React frontend with the Django backend via Axios.
- Applied premium design principles with glassmorphism, smooth transitions, and a curated color palette.
- Ensured the application is fully responsive for both mobile (customer) and desktop (admin) views.
- Configured Git version control and established a clean project structure.

## Tech Stack
- Frontend: React, Vite, Tailwind CSS, Axios, Lucide React.
- Backend: Django, Django Rest Framework, SQLite (Development).
- Tools: Git, CSV, QR Code API.
