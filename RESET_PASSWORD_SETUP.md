# Reset Password Functionality Setup

## Overview
The reset password functionality has been completely implemented with the following features:

1. **Forgot Password**: Users can request a password reset via email
2. **Email Verification**: Only verified emails can request password resets
3. **Secure Token Generation**: JWT tokens with 1-hour expiration
4. **Password Strength Meter**: Real-time password strength validation
5. **Strong Password Requirements**: Enforces strong password criteria
6. **Password History**: Prevents reuse of last 5 passwords
7. **Beautiful UI**: Modern, responsive design with clear feedback

## Required Environment Variables

Create a `.env` file in the `backend` directory with:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/bspokehealth"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-here"

# Email Configuration (for password reset)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# Server Configuration
PORT=3000
NODE_ENV=development
```

## Email Setup

For Gmail, you need to:
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password in EMAIL_PASS

## How It Works

### 1. Forgot Password Flow
1. User visits `/forgot-password`
2. Enters their email address
3. System validates email exists and is verified
4. Generates secure JWT token
5. Sends email with reset link: `http://localhost:3000/set-new-password?token=...`

### 2. Password Reset Flow
1. User clicks email link
2. Lands on `/set-new-password` with token
3. Enters new password with real-time strength validation
4. Confirms password
5. System validates token and updates password
6. Redirects to login page

## Password Strength Requirements

The password must meet ALL of these criteria:
- ✅ At least 8 characters
- ✅ At least one uppercase letter (A-Z)
- ✅ At least one lowercase letter (a-z)
- ✅ At least one number (0-9)
- ✅ At least one special character (!@#$%^&*(),.?":{}|<>)
- ✅ No common patterns (password, 123456, qwerty, etc.)

## Security Features

- **Token Expiration**: 1-hour expiration on reset tokens
- **Password History**: Prevents reuse of last 5 passwords
- **Rate Limiting**: Prevents brute force attacks
- **CSRF Protection**: Cross-site request forgery protection
- **Secure Hashing**: bcrypt with salt rounds
- **Input Validation**: Comprehensive validation on all inputs

## Testing

1. Start the backend:
   ```bash
   cd backend
   npm start
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Test the flow:
   - Go to `/forgot-password`
   - Enter a verified email
   - Check email for reset link
   - Click link and set new password
   - Verify you can login with new password

## Files Modified

### Backend
- `controller/authController.js` - Enhanced reset password logic
- `routes/authRoutes.js` - Added new routes
- `utils/email.js` - Improved email templates
- `app.js` - Fixed CORS configuration

### Frontend
- `pages/ResetPassword.jsx` - New component with strength meter
- `context/AuthContext.jsx` - Updated API calls
- `utils/axios.js` - Fixed API configuration
- `App.jsx` - Added new routes

## Troubleshooting

### Email Not Sending
- Check EMAIL_USER and EMAIL_PASS in .env
- Verify Gmail App Password is correct
- Check console for email errors

### Token Invalid
- Ensure JWT_SECRET is set
- Check token expiration (1 hour)
- Verify database connection

### Password Not Strong Enough
- Password must meet all 6 criteria
- Check the strength meter feedback
- Try a more complex password

### CORS Errors
- Backend is configured for multiple origins
- Check browser console for CORS errors
- Verify frontend is running on correct port 