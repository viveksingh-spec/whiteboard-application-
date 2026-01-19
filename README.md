# Writeboard...........
A simple, fast whiteboard app where you can draw, write, and manage multiple canvases. Built as a full‑stack project with a React (Vite) frontend and an Express + MongoDB backend.

Live link : https://whiteboard-application-black.vercel.app/


## Key features........

- **Freehand drawing + shapes**: brush, line, rectangle, circle, arrow
- **Text tool** and **eraser**
- **Undo / Redo** for drawing history
- **Multiple canvases**: create, switch, delete
- **Autosave**: canvas updates are saved to the backend (debounced to avoid spamming)
- **Authentication**: register/login with JWT access token
- **Refresh-token flow**: access token can be renewed using a refresh token stored in an httpOnly cookie


# Tech stack...........

**Frontend**
1> React + Vite
2> Tailwind CSS
3> Axios
4> roughjs + perfect-freehand

**Backend**
1> Node.js + Express
2> MongoDB + Mongoose
3> JWT (access token + refresh token)
4> CORS + cookie-parser


# Project structure.......

- `frontend/` – React app (Vite)
- `backend/` – Express API

---

# To Run locally

# 1) Backend..

```bash
cd backend
npm install
npm run dev
```

Create `backend/.env`:

```dotenv
PORT=5050
DATABASE_URL=<dataabase-url-string>

ACCESSTOKENSECRET=<random-secret>
ACCESSTOKENTIME=1d (short lived)

REFRESHTOKENSECRET=<random-secret>
REFRESHTOKENTIME=15d (long lived)

NODE_ENV=development
```

# 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Create `frontend/.env`:

```dotenv
VITE_BACKEND_URL=http://localhost:5050
```

Open http://localhost:5173


## Deployment notes

- The **frontend** is deployed on Vercel.
- The **backend** should be deployed on a public **HTTPS** host (e.g. Render) so that cross-site cookies (refresh token) work correctly.

When deploying:
- Set `VITE_BACKEND_URL` on Vercel to your backend URL (example: `https://your-app.onrender.com`).
- In production, set `NODE_ENV=production` on the backend so refresh cookies use `Secure` + `SameSite=None`.
- Update backend CORS `origin` to your frontend domain.


## API overview

Auth:
- `POST /user/register`
- `POST /user/login`
- `POST /user/refresh`

Canvas:
- `GET /canvas/getall`
- `GET /canvas/get/:id`
- `POST /canvas/create`
- `PUT /canvas/update`
- `DELETE /canvas/delete/:id`


# Credits

Made by Vivek Singh.
