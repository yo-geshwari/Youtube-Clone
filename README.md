# 🎬 VibeTube — Backend API

The backend API for **VibeTube**, a full-stack video-sharing platform inspired by YouTube.  
It handles user authentication, video uploads, session management, and video data storage.

🌐 **Live API Hosted On**: Railway
---

## ⚙️ Tech Stack

- **Node.js + Express.js** — RESTful server & routing
- **MongoDB + Mongoose** — NoSQL database to store user and video data
- **JWT** — Secure, stateless authentication
- **Cookie-Session** — Persistent login using cookies
- **Cloudinary** — Media upload and storage (videos + thumbnails)
- **CORS + dotenv** — Secure API configuration and environment control

---

## 🚀 Features

- 🔐 **Authentication**
  - Register / Login / Logout
  - JWT + Cookie-based session management
- 📹 **Video Handling**
  - Upload videos to Cloudinary
  - Fetch all public videos
  - Get current user’s uploaded videos
- 🧾 **Protected Routes**
  - Uploading and dashboard require active session

---

## 🔧 What I Learned

- 🧱 Structuring scalable Express apps with controllers and middleware  
- ☁️ Integrating Cloudinary for large video uploads  
- 🔐 Managing secure sessions with cookies and JWT  
- 🗃️ MongoDB schema design for users and videos  
- ⚙️ Environment configuration for deployment  

---

## 🙌 Final Notes

This backend powers the **VibeTube** video platform —  
a solo **MERN stack** project to build scalable, modern web apps with real-world features.

**Made with ❤️, Node.js, and a lot of console.logs.**

