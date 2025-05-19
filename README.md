
# 📦 Digital Archiving System – Towfiq Logistics

This is a full-stack document archiving and management platform designed for **Towfiq Logistics**. The backend is built using **Node.js (Express)**, and the frontend uses **React (Next.js)**.

---

## 🚀 How to Run the Application Locally

### 1. Clone the Repository
```bash
git clone https://github.com/nathanrufus/Digital-Archiving-System.git
cd Digital-Archiving-System
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Setup Environment Variables

Create a `.env` file inside `/backend` with the following contents:

```env
MONGODB_URI=mongodb+srv://nathanrufus:6131a21a@digital-archiving.sxl5y9h.mongodb.net/
JWT_SECRET=gjhjhhgyygygutuuhhbhh
PORT=5000
```

Create a `.env.local` file inside `/frontend/archive-system` with:

```env
NEXT_PUBLIC_API_BASE=http://localhost:5000/api
```

### 4. Ensure Required Directories Exist
In the `/backend` folder, ensure the following folders are created (if not already present):
```bash
mkdir uploads backups
```

### 5. Start the Backend Server
```bash
npm run dev
```
Runs at: [http://localhost:5000](http://localhost:5000)

### 6. Install Frontend Dependencies
Open a new terminal and run:
```bash
cd frontend/archive-system
npm install
```

### 7. Start the Frontend Server
```bash
npm run dev
```
Runs at: [http://localhost:3000](http://localhost:3000)

---

##  Project Structure

```
Digital-Archiving-System/
├── backend/
│   ├── backups/           # ZIP archives for backups
│   ├── controllers/       # Business logic
│   ├── middlewares/       # Auth and error handlers
│   ├── models/            # Mongoose models
│   ├── restored/          # Restored files from backups
│   ├── routes/            # Express routes
│   ├── tests/             # Backend tests (optional)
│   ├── uploads/           # Uploaded documents
│   └── app.js             # Express app entry
├── frontend/
│   └── archive-system/
│       ├── app/           # Next.js App Router structure
│       ├── components/    # UI components
│       ├── context/       # Auth and global state
│       ├── public/        # Static assets
│       └── .env.local     # Frontend environment config
└── README.md
```

---

##  Features

### Backend (Node.js + Express + MongoDB)
-  User authentication with JWT
-  Secure file uploads via Multer
-  Document metadata storage (MongoDB)
-  Backup & restore functionality (ZIP archive)
-  Folder/tag/category handling
-  Role-based access protection

### Frontend (React + Next.js + Tailwind CSS)
-  User login & registration
-  Drag-and-drop document upload
-  Select folder, device, tags, and description fields
-  View, search, and filter documents
-  Initiate backup or restore from UI
-  Responsive design

---

##  File Handling
- Uploaded files are stored in `/backend/uploads/`
- Backups are saved to `/backend/backups/`
- Restores extract into `/backend/restored/`

---

## Authentication
- Login returns JWT stored in `localStorage`
- Protected routes on both frontend and backend validate token

---

## Notes
- `node_modules` and `.env` files are excluded from Git for security and performance.
- MongoDB Atlas should be accessible and properly configured before running the app.
- This system is intended for internal use and document lifecycle management in logistics operations.

---


## For now
navigate to http://localhost:3000/register and proceed from there where you will register and taken to login page programatically then to dashboard. You will now proceed from there.
You login first in order to get authenticated.
I will finish everything by tomorrow just few bugs to take care and i will bundle everything such that it will be seamless