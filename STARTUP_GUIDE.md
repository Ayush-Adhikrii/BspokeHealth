# Startup Guide - Fixing CSRF Token Error

## The Problem
You're getting a CSRF token error because the frontend can't connect to the backend server. The error shows:
```
Failed to fetch CSRF token: AxiosError code: "ERR_NETWORK"
```

## Solution Steps

### 1. Start the Backend Server First

Open a terminal and run:
```bash
cd backend
npm install  # if you haven't already
npm start
```

You should see:
```
PostgreSQL connected successfully
Server running on https://localhost:3000
```

### 2. Test Backend Connection

In another terminal, test if the backend is accessible:
```bash
node test-backend-connection.js
```

You should see:
```
✅ Health check passed: { status: 'ok', message: 'Backend server is running' }
✅ CSRF token endpoint working: Token received
🎉 Backend is accessible and working!
```

### 3. Start the Frontend

In a new terminal:
```bash
cd frontend
npm install  # if you haven't already
npm run dev
```

You should see:
```
VITE v5.x.x ready in xxx ms
➜ Local: https://localhost:5173/
```

### 4. Verify Everything Works

1. Open your browser to `https://localhost:5173`
2. Check the browser console - you should see:
   ```
   App initialized with CSRF protection
   CSRF token fetched: [some-token]
   ```

## What I Fixed

### Backend Changes:
1. **Moved CSRF middleware** - Now only applies to routes that need it
2. **Added health check endpoint** - `/api/health` to test connectivity
3. **Fixed CORS** - Now accepts multiple origins properly

### Frontend Changes:
1. **Better error handling** - Graceful handling of network errors
2. **Improved CSRF token fetching** - More robust with timeouts
3. **Clear error messages** - Tells you when backend is not running

## Troubleshooting

### If Backend Won't Start:
- Check if port 3000 is already in use
- Make sure PostgreSQL is running
- Check your `.env` file has correct database URL

### If Frontend Still Shows CSRF Errors:
- Make sure backend is running on port 3000
- Check browser console for specific error messages
- Try refreshing the page

### If Database Connection Fails:
- Ensure PostgreSQL is running
- Check your DATABASE_URL in `.env`
- Run `npx prisma db push` to sync database schema

## Quick Test Commands

```bash
# Test backend health
curl https://localhost:3000/api/health

# Test CSRF token
curl -c cookies.txt https://localhost:3000/api/csrf-token

# Check if port 3000 is in use
netstat -an | grep :3000
```

The CSRF token error should now be resolved once you have both servers running! 