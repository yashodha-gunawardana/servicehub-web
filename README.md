# ServiceHub - Web Application

## 📌 Overview

The **ServiceHub Web Application** is the frontend of the ServiceHub Home Service Request System.

It provides a web interface for customers and service providers to interact with the ServiceHub backend services.

---

## 👨‍🎓 Student Information

| Information | Details |
|---|---|
| Student Name | Yashoda Gunawardhana |
| Student ID | 241711077 |
| Project | ServiceHub |
| Component | Web Application |
| GCP Project ID | Not created yet |

---

## 🛠️ Technology Stack

- React
- JavaScript
- Vite
- React Router
- Axios
- Tailwind CSS
- HTML
- CSS

---

## 🏗️ Architecture

The frontend communicates with the backend through the API Gateway.

```
ServiceHub Web
     |
     v
API Gateway :8080
     |
     +-------- User Service
     |
     +-------- Request Service
     |
     +-------- Provider Service
```

---

## 🔗 Backend Communication

Axios is used to communicate with the ServiceHub backend APIs.

The frontend sends requests through:

```
http://localhost:8080
```

The API Gateway then routes the requests to the relevant microservice.

---

## 📄 Main Features

The web application supports features such as:

- User registration
- User login
- Customer dashboard
- Service request management
- Request viewing
- Service provider functionality

Additional features can be added as the project develops.

---

## 📁 Project Structure

```
servicehub-web/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── pages/
│   └── services/
│
├── package.json
├── vite.config.js
├── index.html
└── README.md
```

---

## 🚀 Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The application will normally be available at:

```
http://localhost:5173
```

---

## 🔨 Build

```bash
npm run build
```

---

## 👀 Preview Production Build

```bash
npm run preview
```

---

## 🔗 GitHub Repository

https://github.com/yashodha-gunawardana/servicehub-web

---

## 📌 Project Status

- React: ✅
- Vite: ✅
- React Router: ✅
- Axios: ✅
- Tailwind CSS: ✅
- Backend API Integration: 🔄
- Cloud Run Deployment: ⏳

---
