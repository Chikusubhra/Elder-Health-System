# 🏥 Elder Health Monitoring System

A full-stack web application designed to monitor and manage elderly patients' health data with secure authentication, role-based access control, and real-time alert generation.

---

## 🚀 Project Overview

The **Elder Health Monitoring System** enables caregivers and family members to track vital health metrics such as heart rate, oxygen levels, and blood pressure. The system ensures **secure access**, **role-based functionality**, and **critical health alerts** for timely intervention.

---

## 🎯 Key Features

### 🔐 Authentication & Authorization
- Secure user authentication (JWT / Session-based)
- Role-Based Access Control (RBAC)
- Protected routes and dashboards

### 👥 User Roles

| Role          | Permissions |
|--------------|------------|
| **Care Manager** | Add and manage patient health data |
| **Parent**       | View data + Emergency Button |
| **Child**        | View-only access |

---

## 💻 Frontend Features

- 🔑 Login & Registration System
- 🛡️ Protected Dashboard
- ➕ Add Health Data (Care Manager only)
- 📊 Health Data Visualization
- 🚨 Alerts & History Tracking
- 🎭 Role-Based UI Rendering

---

## ⚙️ Backend Features

### 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|--------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | User login |
| POST | `/api/health` | Add health data |
| GET | `/api/patient/:id` | Get patient data |
| GET | `/api/alerts` | Get alerts |

---

## 🧠 Core Health Logic

The system automatically generates alerts based on health conditions:

- ❤️ **Heart Rate**
  - < 50 or > 110 → ⚠️ Alert

- 🫁 **Oxygen Level**
  - < 92 → 🚨 Critical

- 🩺 **Blood Pressure**
  - > 140/90 → ⚠️ Warning

---

## 🗄️ Database

- **MongoDB** used for data storage
- Structured schema for:
  - Users
  - Patients
  - Health Records
  - Alerts

---

## 🛠️ Tech Stack

### Frontend
- React.js / Next.js
- Tailwind CSS / CSS
- Axios

### Backend
- Node.js
- Express.js

### Database
- MongoDB (Mongoose)

---

## 📂 Project Structure
Elder-Health-System/
│
├── frontend/ # UI (React / Next.js)
├── backend/ # API (Node + Express)
├── models/ # Database schemas
├── routes/ # API routes
├── middleware/ # Auth & role middleware
└── README.md


---

## 🔒 Security Features

- JWT Authentication
- Password Hashing (bcrypt)
- Protected Routes
- Role-based Middleware

---

## 📦 Installation & Setup

### 1️⃣ Clone the repository
'''bash'''
  git clone https://github.com/Chikusubhra/Elder-Health-System.git
  cd Elder-Health-System
2️⃣ Install dependencies
cd backend
npm install

cd ../frontend
npm install
3️⃣ Setup environment variables

Create a .env file in backend:

PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
4️⃣ Run the application
# Backend
npm run dev

# Frontend
npm run dev

🤝 Contribution

This project was developed as part of an assignment and is open for learning and improvements.

📧 Contact
Subhrajit Das
📧 subhrajitdaschiku@gmail.com

🔗 GitHub: https://github.com/Chikusubhra

⭐ Acknowledgment

This project demonstrates practical implementation of:

Authentication & Authorization
Full-stack Development
Real-world healthcare problem solving

---
