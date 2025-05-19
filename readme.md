# File Uploader

A simplified Google Drive–style personal storage web application built with:

-   **Frontend:** React.js (Create React App) with Axios, React Toastify for notifications
-   **Backend:** Node.js, Express.js, Passport.js (or JWT), Prisma ORM, PostgreSQL
-   **File Storage:** Cloudinary for production file hosting, local `uploads/` for development

---

## 🔍 Overview

File Uploader allows users to:

1. **Register & Login** securely.
2. **Create**, **rename**, and **delete** folders.
3. **Upload** files to specific folders or as **unsorted**.
4. **View** files in a responsive grid with image previews.
5. **Download**, **move**, and **delete** files.

The app uses session-based authentication or JWT, depending on configuration, and persists user data in PostgreSQL via Prisma. Frontend and backend are decoupled, communicating over a REST API.

---

## 🚀 Features

-   **User Authentication:** Secure sign-up/log-in flow with hashed passwords (bcrypt) and sessions or JWT.
-   **Folder Management:** Full CRUD for user-specific folders.
-   **File Upload & Preview:** Drag-and-drop or button upload, thumbnail previews for images.
-   **Cloud Storage Integration:** Files uploaded to Cloudinary in production, local storage for development.
-   **Responsive UI:** Works across desktop, tablet, and mobile with dynamic layouts.
-   **Toasts & Loading States:** Real-time feedback via React Toastify and button loading indicators.

---

## 🛠️ Tech Stack

| Layer      | Technology                   |
| ---------- | ---------------------------- |
| Frontend   | React, Axios, React Toastify |
| Backend    | Node.js, Express             |
| ORM        | Prisma                       |
| Database   | PostgreSQL                   |
| File Host  | Cloudinary (prod) / local    |
| Auth       | Passport.js (local) or JWT   |
| Deployment | Render.com (frontend & API)  |

---

## 📦 Getting Started

Clone the repo:

```bash
git clone https://github.com/stef44n/file-uploader.git
cd file-uploader
```

### Backend

```bash
# Install dependencies
npm install

# Set up environment vars (.env)
# DATABASE_URL=postgresql://user:pass@host:5432/dbname
# SESSION_SECRET=your_session_secret
# JWT_SECRET=your_jwt_secret
# CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME

# Run migrations
npx prisma migrate dev

# Start server
npm run start:server
```

### Frontend

```bash
cd clientt
npm install

# Create .env file
# REACT_APP_API_URL=https://your-backend.render.com

npm start    # for development
npm run build  # production build
```

Visit `http://localhost:3000` to explore.

---

## ⚙️ Environment Variables

| Variable          | Purpose                            |
| ----------------- | ---------------------------------- |
| DATABASE_URL      | PostgreSQL connection string       |
| SESSION_SECRET    | Secret for session cookies         |
| JWT_SECRET        | Secret for JWT signing             |
| CLOUDINARY_URL    | Cloudinary API credentials         |
| REACT_APP_API_URL | Frontend API base URL (production) |

---

## 📁 Project Structure

```
file-uploader/
├─ src/
│  ├─ config/        # DB & Passport config
│  ├─ middleware/    # auth & upload middleware
│  ├─ routes/        # API route handlers
│  ├─ utils/         # cloudinary client, etc.
│  └─ server.js      # Express app entry
├─ clientt/          # React app
└─ README.md         # Project overview
```

---

## 🛣️ Future Enhancements

Below are some ideas for potential improvements and new features to elevate File Uploader:

-   **Folder Sharing**: Implement time‑limited, tokenized share links for public folder access (planned).
-   **Drag‑and‑Drop Uploads**: Allow users to drag multiple files/folders onto the page to upload.
-   **Bulk Actions**: Select multiple files/folders to move, download, or delete in one operation.
-   **Search & Filter**: Add a search bar and filters (by date, file type, size) to quickly find items.
-   **Pagination / Infinite Scroll**: Implement lazy loading or pagination for large file sets.
-   **User Profiles**: Enable users to manage their profile, change passwords, and update email.
-   **Activity Logs**: Track user actions (uploads, deletes) and display an audit log.
-   **Responsive Enhancements**: Improve mobile gestures (e.g. swipe to delete) and accessibility (ARIA labels).

---

## 📝 License

MIT © stef44n
