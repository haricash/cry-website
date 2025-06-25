# Cry Tracker 🥲

A simple app to anonymously track and visualize when someone cries.

## 🧱 Stack
- React + Vite frontend
- Express.js backend with SQLite

## 🚀 Deployment Instructions

### Deploy the Backend (Render.com)
1. Push the `server/` directory to its own GitHub repo
2. Go to [https://render.com](https://render.com)
3. Create a new Web Service:
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Root Directory: `server`

### Deploy the Frontend (Vercel)
1. Push the `client/` directory to its own GitHub repo
2. Go to [https://vercel.com](https://vercel.com)
3. Create a new project, connect the repo
4. In Vercel settings:
   - Add a Rewrite in `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://your-render-backend-url.onrender.com/api/$1" }
  ]
}
```

5. Vercel will build the frontend and redirect `/api/...` calls to your backend

## 🔐 Privacy
- IPs are hashed and deleted after 1 hour
- Only timestamps are stored long-term
