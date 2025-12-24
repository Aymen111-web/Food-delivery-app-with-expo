
# Food Delivery App (Expo + React Native)

This is a complete Food Delivery Application built with React Native and Expo. It features a secure-feeling authentication system, role-based access control (Customer vs Admin), and comprehensive dashboards for both roles.

## Features

### 🔐 Authentication & Roles
- **Mock Authentication**: Works immediately without backend setup.
- **Role-Based Routing**: 
  - **Customers** are routed to the Home/Tabs view.
  - **Admins** are routed to the Admin Dashboard.
- **Persistence**: Login session is persisted using `expo-secure-store`.

### 👤 Customer App
- **Home**: Browse Categories and Restaurants. Search functionality included.
- **Cart**: Add items, adjust quantities, and simulate checkout.
- **Orders**: View order history and status.
- **Profile**: Manage account and logout.

### 🛡️ Admin Dashboard
- **Dashboard**: Overview of key metrics (Orders, Revenue).
- **Management**:
  - **Restaurants**: View and delete restaurants.
  - **Menu Items**: Manage food items and availability.
  - **Categories**: Add and delete food categories.
  - **Orders**: View all orders and update their status (e.g. Pending -> Delivered).
  - **Users**: Manage user accounts.

## 🚀 How to Run

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the App**
   ```bash
   npx expo start -c
   ```
   Scan the QR code with your phone (Expo Go app) or run on a Simulator.

## 🧪 How to Test

### Login Credentials (Mock)

**To test Admin features:**
- Email: `admin@test.com` (Must contain 'admin')
- Password: `any`

**To test Customer features:**
- Email: `user@test.com` (Any email NOT containing 'admin')
- Password: `any`

### Demo Hints
- **Add to Cart**: Go to Home, click the `+` icon on any popular menu item.
- **Checkout**: Go to Cart tab, click "Place Order".
- **Admin Actions**: Log in as admin, tap "All Orders" to change status of customer orders.
