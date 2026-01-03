# Implementation Setup Guide

## What Was Implemented

### ✅ Backend Changes

1. **User Controller** (`backend/src/controllers/userController.js`)
   - Updated `syncUser()` to store user with `plmEmail` field
   - Added `checkUserApprovalStatus()` endpoint to verify if user is approved

2. **User Routes** (`backend/src/routes/userRoutes.js`)
   - Added `GET /api/users/approval-status` endpoint (protected)

3. **Auth Middleware** (`backend/src/middleware/authMiddleware.js`)
   - Updated `protectRoute()` to attach MongoDB user object to `req.user`
   - Now properly fetches user from database and makes it available to all protected routes

4. **Admin Controller** (`backend/src/controllers/adminController.js`)
   - Updated `approveUser()` to send email notification when account is approved
   - Uses nodemailer to send approval emails to user's `plmEmail`

5. **Environment Config** (`backend/src/lib/env.js`)
   - Added `EMAIL_USER` and `EMAIL_PASSWORD` environment variables

6. **Package.json**
   - Added `nodemailer` dependency (v6.9.7)

### ✅ Mobile Changes

1. **Auth Hook** (`mobile/hooks/useSocialAuth.ts`)
   - Updated `useEmailUsernameAuth()` to check approval status after sign-in
   - If user not approved: blocks entry, shows alert
   - If user approved: redirects to home screen

2. **Auth Screen** (`mobile/app/(auth)/index.tsx`)
   - Fixed `handleVerify()` to properly redirect after email verification
   - Now always redirects to home after successful verification

---

## Required Setup Steps

### 1. Backend Environment Variables

Add to your `.env` file in the backend:

```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-password
```

**For Gmail:**
- Use an [App Password](https://support.google.com/accounts/answer/185833) (not your regular password)
- Enable 2-Factor Authentication first
- Generate a 16-character app password

**Alternative Email Services:**
If not using Gmail, update the transporter in `adminController.js`:
```javascript
// For SendGrid
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey",
    pass: ENV.SENDGRID_API_KEY,
  },
});
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Mobile Environment Variable (Optional)

In your mobile `.env.local` or Expo config, set:

```env
EXPO_PUBLIC_API_URL=http://localhost:5000
```

(or your deployed backend URL)

---

## User Flow

### Signup & Approval Workflow

```
1. User Signs Up (Email + Username)
   ↓
2. Email Verification
   ↓
3. Account Created in MongoDB (isApproved: false)
   ↓
4. Redirected to Home (app/index.tsx)
   ↓
5. User Attempts Sign In
   ↓
6. Check approval status via /api/users/approval-status
   ↓
7a. NOT APPROVED → Block entry, show alert
7b. APPROVED → Redirect to home
   ↓
8. Admin Approves Account
   ↓
9. Email Sent to plmEmail with approval notification
   ↓
10. User Can Now Sign In
```

---

## API Endpoints

### Check Approval Status
```
GET /api/users/approval-status
Headers: Authorization (handled by Clerk)
Response: { isApproved: boolean, user: User }
```

### Approve User (Admin Only)
```
PATCH /api/admin/approve/:userId
Headers: Authorization (admin only)
Response: { message: string, user: User }
```

---

## Testing Checklist

- [ ] Backend server starts without errors
- [ ] Nodemailer is properly installed
- [ ] Email credentials are configured
- [ ] User can sign up with email
- [ ] Email verification code works
- [ ] User redirected to home after verification
- [ ] User cannot sign in before approval
- [ ] Admin can approve user
- [ ] Approval email is sent successfully
- [ ] User can sign in after approval
- [ ] User is redirected to home on successful sign-in

---

## Files Modified

### Backend
- `backend/src/controllers/userController.js` - Added checkUserApprovalStatus
- `backend/src/routes/userRoutes.js` - Added approval-status route
- `backend/src/middleware/authMiddleware.js` - Enhanced protectRoute middleware
- `backend/src/controllers/adminController.js` - Added email notifications
- `backend/src/lib/env.js` - Added email config
- `backend/package.json` - Added nodemailer

### Mobile
- `mobile/hooks/useSocialAuth.ts` - Added approval checking
- `mobile/app/(auth)/index.tsx` - Fixed verification redirect

---

## Troubleshooting

### Email not sending?
1. Verify `EMAIL_USER` and `EMAIL_PASSWORD` are correct
2. Check Gmail [App Passwords](https://support.google.com/accounts/answer/185833)
3. Look at server console for nodemailer errors

### User can't sign in after approval?
1. Restart the mobile app
2. Check backend logs for approval status endpoint
3. Verify user's `isApproved` field in MongoDB is `true`

### User redirects to home but account not approved?
1. Admin must call approve user endpoint
2. User must sign out and sign in again to check status
3. Backend may need restart to clear session cache

