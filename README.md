# IntervueX

> A full-stack real-time technical interview platform with collaborative coding, video calling, real-time chat, authentication, and code execution.

## 🚀 Live Demo

** https://intervue-x-eosin.vercel.app/
---

## 📌 Overview

**IntervueX** is a full-stack technical interview platform designed to simulate a real-world coding interview environment.

It allows an interviewer and candidate to create or join a private interview session, solve coding problems together, communicate through real-time video and chat, and execute code in multiple programming languages.

The project combines modern frontend development, backend APIs, authentication, real-time communication, database management, and third-party service integration into a single application.

---

## ✨ Features

### 👤 Authentication

- User authentication using **Clerk**
- Secure protected routes
- User synchronization between Clerk and MongoDB
- User creation and deletion synchronization using **Inngest**

### 🧑‍💻 Collaborative Coding

- Dedicated coding interview workspace
- Problem-based coding sessions
- Support for multiple programming languages
- Monaco-based code editor
- Code execution with JDoodle
- Execution output and error handling

### 🎥 Real-Time Video Interview

- 1-on-1 video calling
- Real-time participant management
- Join and leave interview sessions
- Powered by **Stream Video SDK**

### 💬 Real-Time Chat

- In-session real-time messaging
- Private session-based chat
- Powered by **Stream Chat**

### 🏠 Interview Sessions

- Create a new coding interview session
- Select coding problem and difficulty
- Join active sessions
- Session status tracking
- Host and participant roles
- End interview sessions
- Recent completed sessions

### 📊 Dashboard

- Active interview sessions
- Recent interview history
- Session statistics
- Create and join interview rooms

### ⚡ Real-Time Updates

- Live video communication
- Live chat
- Session synchronization
- Automatic participant updates

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- JavaScript
- Tailwind CSS
- DaisyUI
- React Router
- TanStack React Query
- Monaco Editor
- Axios
- React Hot Toast

### Backend

- Node.js
- Express.js
- REST APIs
- MongoDB
- Mongoose
- Clerk Express
- Inngest

### Real-Time Services

- Stream Video SDK
- Stream Chat

### Authentication

- Clerk

### Code Execution

- JDoodle API

### Deployment

- Vercel — Frontend
- Render — Backend
- MongoDB Atlas — Database

---

## 🏗️ Architecture

```text
                    ┌──────────────────────────┐
                    │        React Frontend    │
                    │      Vercel Deployment   │
                    └────────────┬─────────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
                ▼                ▼                ▼
          Clerk Auth        REST APIs        Stream SDK
                │                │                │
                │                ▼                ├── Video
                │          Express Backend      └── Chat
                │            Render
                │                │
                │        ┌───────┴────────┐
                │        ▼                ▼
                │   MongoDB Atlas      Inngest
                │
                ▼
          User Authentication
