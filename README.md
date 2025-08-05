📦 Warehouse Inventory Management – Mobile App

Warehouse Inventory Management is a mobile application developed using React Native to help businesses efficiently manage their inventory processes anytime and anywhere. The app provides real-time stock tracking, intuitive product management, warehouse support, and an optimized user experience for operational efficiency.

🔧 Project Overview

This application allows warehouse employees and admins to perform essential stock operations such as:

Adding, editing, and deleting products

Viewing product details and real-time stock status

Creating stock in/out transactions

Receiving low-stock alerts and push notifications

Exporting stock movement reports (CSV-ready)

Managing multiple warehouses (optional)

The app is designed with a clean and accessible UI, considering both tech-savvy users and staff members unfamiliar with digital tools.

✨ Features

✔️ User Authentication (JWT via Laravel Passport)
✔️ Role-based access control (Admin, Warehouse Staff)
✔️ Real-time stock updates (WebSocket integration)
✔️ Manual barcode input for products (optimized for performance)
✔️ Dynamic reporting screen with filters (product, warehouse, type)
✔️ Alerts when stock drops below threshold
✔️ CSV Export button (ready for backend integration)
✔️ Multi-warehouse support
✔️ Clean, responsive UI with NativeWind styling
✔️ State management with Zustand
✔️ Form handling via react-hook-form
✔️ Push notifications with OneSignal
✔️ Camera-based barcode scanning (optional & removed due to performance)

📱 Screens

Login / Register

Admin Panel

Product List

Product Add/Edit

Stock In/Out

Transaction History

Report Screen (with filters and export)

Notification Screen

Profile Page

🛠️ Tech Stack

Frontend:

React Native (Expo/CLI)

Zustand (state management)

React Navigation

React Hook Form

Axios (API integration)

NativeWind (Tailwind-like styling)

OneSignal (Push Notifications)

Backend (Not part of this repo):

Laravel 10

Laravel Passport (JWT authentication)

WebSocket

Telescope (Monitoring)

MySQL

XAMPP (development database)

📁 Folder Structure

/mobile
│
├── frontend/ # Application source code
│ ├── screens/ # Screens (Login, AdminPanel, etc.)
│ ├── components/ # Reusable UI components
│ ├── services/ # Axios services & API logic
│ ├── assets/ # Images, logos, icons
│ ├── utils/ # Utility functions
│ └── ...
│
├── App.js # Root of the app
├── package.json # Project dependencies
├── README.md # Project documentation

📈 Project Progress

The app was developed during a CO-OP internship program. The initial project structure and database schema (ERD) were designed in the first week. As development progressed:

Weeks 2–3: Authentication flow, product management, and UI layouts were implemented.

Weeks 4–5: Reporting system and stock alert logic were completed.

Weeks 6–7: Frontend-backend API integration was completed using Postman. Barcode scanning was refactored to manual entry for better performance.

📤 How to Run

Clone the repository:

git clone https://github.com/your-username/warehouse-inventory-management

Navigate to the mobile app folder:

cd mobile/frontend

Install dependencies:

npm install

Start the app:

npx expo start

Ensure the backend Laravel server is running and API endpoints are correctly configured in services/api.js.

✅ Requirements

Node.js ≥ 18

Expo CLI or React Native CLI

Laravel backend with Passport authentication

OneSignal API key (for push notifications)

XAMPP or live database for MySQL

🚧 Known Issues

Barcode scanning caused performance drops on lower-end devices. Switched to manual product code input.

CSV export is currently front-end only — needs backend endpoint for actual file generation.

📌 Upcoming Features

Admin dashboard enhancements

PDF/Excel export support

Warehouse transfer logic

Theme customization

📄 License

This project is developed as part of a university CO-OP internship and is for educational and demonstration purposes.
