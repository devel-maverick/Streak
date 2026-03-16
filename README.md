# Streak – Full Stack Coding Platform

Streak is a full-stack coding practice platform where users can solve coding problems, run code in an in-browser editor, and maintain a daily problem-solving streak.  
It provides company-tagged problems, a real-time code execution environment, and user authentication.

The goal of this project is to create a **LeetCode-like platform** with streak tracking to encourage consistent problem solving.

---

## ✨ Features

- 🔐 **JWT Authentication** – Secure signup and login system  
- 💻 **In-Browser Code Editor** – Powered by Monaco Editor  
- ⚡ **Real-time Code Execution** – Integrated with Judge0 API
- 🏷 **Company-Tagged Problems** – Practice problems asked by companies  
- 🧠 **Multi-language Support** – Run code in multiple programming languages  
- 📈 **Submission Tracking** – Store and track user submissions  
- 🎯 **Responsive UI** – Built using modern React architecture  

---

## 🛠 Tech Stack

### Frontend
- React  
- Vite  
- TailwindCSS  
- Monaco Editor  

### Backend
- Node.js  
- Express.js  

### Database
- PostgreSQL  
- Prisma ORM  

### Code Execution
- Judge0 API  

---

## 📂 Project Structure

```
Streak
│
├── Frontend
│   ├── src
│   ├── components
│   ├── pages
│   └── utils
│
├── Backend
│   ├── src
│   │   ├── controllers
│   │   ├── routes
│   │   ├── middleware
│   │   └── server.js
│   │
│   ├── prisma
│   │   └── schema.prisma
│   │
│   └── services
│       └── judge0.service.js
│
└── README.md
```

---

# ⚙️ Installation & Setup

Clone the repository

```bash
git clone https://github.com/yourusername/streak.git
cd streak
```

---

## 1️⃣ Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file

```
DATABASE_URL=your_postgres_database_url
JWT_SECRET=your_secret_key
JUDGE0_API_KEY=your_api_key
```

Run database migrations

```bash
npx prisma migrate dev
```

Start backend server

```bash
npm run dev
```

Backend runs on

```
http://localhost:5000
```

---

## 2️⃣ Frontend Setup

Open a new terminal

```bash
cd Frontend
npm install
npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

# 🧠 How It Works

1. User signs up or logs in using JWT authentication  
2. Coding problems are fetched from the backend database  
3. The user writes code in the Monaco editor  
4. Code is sent to the backend API  
5. Backend forwards the request to **Judge0 API** for compilation and execution  
6. The result is returned and displayed to the user

---

# 📸 Screenshots

```
<img width="1364" height="788" alt="Screenshot 2026-03-16 at 8 02 16 PM" src="https://github.com/user-attachments/assets/65b7ba4a-18c0-4b8d-b30e-c868ba562d5b" />
<img width="1254" height="698" alt="Screenshot 2026-03-16 at 8 02 56 PM" src="https://github.com/user-attachments/assets/4ef1a934-ca77-49fc-8406-57d4713f528d" />
<img width="911" height="796" alt="Screenshot 2026-03-16 at 8 03 45 PM" src="https://github.com/user-attachments/assets/25ec0b8d-a1aa-4d20-b26a-930e26db97f7" />

```

Examples

- Problem solving interface  
- Code editor  
- Dashboard  
- Streak tracking  

---

# 🎯 Future Improvements

- Contest mode  
- Leaderboards
- Sync Platform Solved Problems
- In-browser Problems Solving
- Discussion section  
- Code plagiarism detection  

---

# Author

**Maverick**

Built as a full-stack project to practice system design, backend architecture, and coding platform development.
