# Cookie Implementation for BspokeHealth

## Overview
This document describes the implementation of cookie-based storage to replace localStorage and sessionStorage usage in the BspokeHealth application.

## Changes Made

### 1. Enhanced Cookie Utility (`frontend/src/utils/cookie.js`)
- Added `setSessionCookie()` function for session-based cookies
- Added appointment-specific cookie functions:
  - `setAppointmentData()` - Stores appointment booking data
  - `getAppointmentData()` - Retrieves appointment booking data
  - `clearAppointmentData()` - Clears appointment booking data
- Added utility functions to clear localStorage and sessionStorage:
  - `clearAllLocalStorage()` - Clears all localStorage data
  - `clearAllSessionStorage()` - Clears all sessionStorage data

### 2. Updated Authentication Context (`frontend/src/context/AuthContext.jsx`)
- Already using cookies for authentication (token and user data)
- Enhanced logout function to clear localStorage and sessionStorage

### 3. Updated Appointment Booking Flow
- **DoctorDetailPage.jsx**: Replaced sessionStorage with cookie storage
- **BookAppointmentPage.jsx**: Replaced sessionStorage with cookie storage
- **LoginPage.jsx**: Added logic to handle redirect after login using cookie data

### 4. Application Initialization (`frontend/src/App.jsx`)
- Added automatic clearing of localStorage and sessionStorage on app startup

## Cookie Usage

### Authentication Cookies
- `token` - JWT authentication token
- `user` - User data (role, kyc_status)
- `deviceId` - Device fingerprint for security

### Session Cookies (Appointment Booking)
- `bookAppointmentWith` - Doctor ID for appointment booking
- `appointmentDate` - Selected appointment date
- `timeSlotId` - Selected time slot ID

## Benefits
1. **Security**: Cookies can be configured with httpOnly, secure, and sameSite flags
2. **Automatic Expiration**: Session cookies expire when browser closes
3. **Server-Side Access**: Cookies can be read by the server for additional security
4. **No localStorage**: Eliminates XSS vulnerabilities from localStorage
5. **Consistent Storage**: All data now uses the same storage mechanism

## Flow
1. User tries to book appointment without being logged in
2. Appointment data is stored in session cookies
3. User is redirected to login page
4. After successful login, appointment data is retrieved from cookies
5. User is redirected to appointment booking page
6. Appointment data is cleared from cookies after successful booking

## Console Logging
The implementation includes console logging for debugging:
- Cookie operations (set, get, remove)
- Appointment data operations
- localStorage/sessionStorage clearing operations 