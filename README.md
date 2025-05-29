Real-Time Location Tracker for Multivendor Delivery Platform

A real-time location tracking system for multivendor delivery platforms like **Dunzo** or **Rapido**. This project allows vendors to assign delivery partners to orders and lets customers track delivery agents in real-time using live location updates on a map.

Tech Stack

| Layer        | Technology                    |
|--------------|-------------------------------|
| Frontend     | Next.js, TypeScript           |
| Backend      | Node.js, Express, TypeScript  |
| Database     | MongoDB                       |
| Realtime     | Socket.IO                     |
| Maps         | Leaflet.js / Google Maps API  |
| Auth         | JWT                           |


Features

# Vendor
- Signup/Login
- View list of orders
- Assign delivery partner to orders
- View delivery status

# Delivery Partner
- Signup/Login
- View assigned orders
- Start delivery
- Send real-time location via WebSocket

# Customer
- Track delivery partner on map
- Auto-updating every 2–3 seconds



