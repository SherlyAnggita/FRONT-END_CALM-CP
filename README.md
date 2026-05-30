# 🧠 CALM – Front-End

Front-end web application for **CALM (Care And Life Mode)** — a mental health platform that helps users track their mood and social energy levels.

Built with **Vite** + **React**, connected to the CALM Back-End API.

---

## 🛠️ Tech Stack

| Technology   | Purpose                     |
| ------------ | --------------------------- |
| React        | UI framework                |
| Vite         | Module bundler & dev server |
| Tailwind CSS | Styling                     |
| Axios        | HTTP requests to API        |

---

## ✅ Prerequisites

Make sure the following are installed on your machine:

- [Node.js](https://nodejs.org/) v18 or newer (check with `node -v`)
- [npm](https://www.npmjs.com/) (check with `npm -v`)
- [Git](https://git-scm.com/)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/SherlyAnggita/FRONT-END_CALM-CP.git
cd FRONT-END_CALM-CP
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Open the `.env` file and fill in the required values:

```env
# Back-end API base URL
# For local development:
VITE_API_BASE_URL=http://localhost:5000/

```

> **Note:** All Vite environment variables must start with `VITE_` to be accessible in the app.

### 4. Start the development server

```bash
npm run dev
```

Open your browser at: **http://localhost:5173**

---

## 🔨 Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

### Preview the production build locally

```bash
npm run preview
```

---

## ⚙️ Environment Variables Guide

| Variable            | Description           | Example                  |
| ------------------- | --------------------- | ------------------------ |
| `VITE_API_BASE_URL` | Back-end API base URL | `http://localhost:5000/` |

---

## 📡 URLs

| Environment | URL                          |
| ----------- | ---------------------------- |
| Local       | `http://localhost:5173`      |
| Production  | `https://mycalmspace.online` |

---

## 🐛 Troubleshooting

| Problem                        | Solution                                                                                                       |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| Dependencies fail to install   | Delete `node_modules` and `package-lock.json`, then re-run `npm install`                                       |
| Environment variables not read | Make sure the file is named `.env`, all variables start with `VITE_`, and restart the dev server after changes |
| API not connecting             | Make sure the back-end is running and `VITE_API_BASE_URL` is pointing to the correct address                        |
| Port conflict                  | Change the port in `vite.config.js` or set `VITE_PORT` in `.env`                                               |

---

## 👥 Team

Part of the **CALM Capstone Project** — Coding Camp 2026 powered by DBS Foundation.
**Team ID:** CC26-PSU122
