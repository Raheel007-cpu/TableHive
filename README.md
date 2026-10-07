# TableHive 🍽️

A full-stack multi-restaurant table booking platform where customers can discover restaurants, check real-time availability, and reserve tables, while restaurant owners can manage their profile, capacity, and bookings.

🔗 **Live Demo:** https://tablehive.vercel.app

---

## ✨ Features

### For Customers
- Browse and search restaurants
- Filter by cuisine, price range, location, and rating
- View restaurant details and available time slots
- Book tables in real-time
- Manage personal bookings

### For Restaurant Owners
- Register and manage restaurant profile
- Upload cover image
- Set available time slots and total capacity
- View and manage incoming bookings
- Update booking status (Confirmed / Completed / Cancelled)

### For Admin
- Approve or reject new restaurant registrations
- View platform statistics
- Manage listed restaurants

---

## 🛠️ Tech Stack

**Frontend**
- React + TypeScript
- Vite
- Tailwind CSS
- Axios
- React Hot Toast
- Lucide React

**Backend**
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Multer (Image Upload)
- Cloudinary

---

## 📂 Project Structure

```bash
tablehive/
├── frontend/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── lib/
│   │   └── ...
│   └── ...
├── backend/                 # Backend (Express + TypeScript)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── config/
│   └── ...
└── README.md
