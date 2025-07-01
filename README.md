# Checktoss v3

Checktoss lets manufacturers upload product manuals, generate QR codes, and share them with customers.

## Tech Stack
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Frontend:** React, React Router
- **QR Codes:** `qrcode` npm package
- **Containers:** Docker, Docker Compose

## Setup Instructions
1. **Clone** the repo:
   ```bash
git clone git@github.com:ekuruvilla/checktoss_v3.git
cd checktoss_v3
```

2. **Configure environments**:
   - Copy `backend/.env.example` to `backend/.env` and fill in `MONGO_URI`, `PORT`, `FRONTEND_URL`.
   - Copy `frontend/.env.example` to `frontend/.env` and set `REACT_APP_API_URL` (e.g., `http://localhost:5000/api`).

3. **Run services**:
   ```bash
docker-compose up --build
```

4. **Access**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## Pushing to GitHub
```bash
git init
git add .
git commit -m "Initial commit: scaffold Checktoss v3"
git remote add origin git@github.com:ekuruvilla/checktoss_v3.git
git push -u origin main
```