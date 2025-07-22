# Furbari Backend API

A secure and optimized Node.js Express API for the Furbari pet platform with email authentication.

## Features

- Email Authentication & Verification
- JWT-based Authentication
- Password Reset via Email
- Account Security (Login attempts, account locking)
- Rate Limiting
- Input Validation
- Security Headers (Helmet)
- CORS Configuration
- Error Handling
- MongoDB Integration

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env` and configure your environment variables:

```bash
cp .env.example .env
```

Required environment variables:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret (use a strong random key)
- `EMAIL_USER` - Your email address for sending emails
- `EMAIL_PASSWORD` - App password for your email account
- `CLIENT_URL` - Frontend application URL

### 3. Email Configuration (Brevo SMTP)

**Recommended: Brevo (formerly Sendinblue) SMTP Setup:**

1. **Create a Brevo Account:**
   - Go to [https://www.brevo.com/](https://www.brevo.com/)
   - Sign up for a free account (300 emails/day free tier)

2. **Generate SMTP Credentials:**
   - Log into your Brevo dashboard
   - Go to "SMTP & API" → "SMTP"
   - Copy your SMTP credentials:
     - Host: `smtp-relay.brevo.com`
     - Port: `587`
     - Your login (email)
     - Your SMTP key (password)

3. **Configure Environment Variables:**
   ```env
   EMAIL_SERVICE=brevo
   EMAIL_HOST=smtp-relay.brevo.com
   EMAIL_PORT=587
   EMAIL_USER=your-brevo-login-email@example.com
   EMAIL_PASSWORD=your-brevo-smtp-key
   EMAIL_FROM=noreply@yourdomain.com
   EMAIL_FROM_NAME=Your App Name
   ```

4. **Test Email Configuration:**
   ```bash
   node test-email.js
   ```

**Alternative: Gmail Setup (less recommended for production):**

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password in `EMAIL_PASSWORD`

### 4. Start Development Server
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes

#### Register User
```
POST /api/users/register
```
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "StrongPass123!"
}
```

#### Verify Email
```
GET /api/users/verify-email/:token
```

#### Resend Verification Email
```
POST /api/users/resend-verification
```
**Body:**
```json
{
  "email": "john@example.com"
}
```

#### Login
```
POST /api/users/login
```
**Body:**
```json
{
  "email": "john@example.com",
  "password": "StrongPass123!"
}
```

#### Logout
```
POST /api/users/logout
```
**Headers:** `Authorization: Bearer <token>`

### Password Management

#### Forgot Password
```
POST /api/users/forgot-password
```
**Body:**
```json
{
  "email": "john@example.com"
}
```

#### Reset Password
```
PUT /api/users/reset-password/:token
```
**Body:**
```json
{
  "password": "NewStrongPass123!"
}
```

#### Change Password
```
PUT /api/users/change-password
```
**Headers:** `Authorization: Bearer <token>`
**Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!"
}
```

### User Profile

#### Get Current User
```
GET /api/users/me
```
**Headers:** `Authorization: Bearer <token>`

#### Update Profile
```
PUT /api/users/profile
```
**Headers:** `Authorization: Bearer <token>`
**Body:**
```json
{
  "name": "John Doe Updated",
  "bio": "Pet lover and developer",
  "location": "New York, NY",
  "avatar": "https://example.com/avatar.jpg"
}
```

### System Routes

#### Health Check
```
GET /health
```

## Security Features

### Rate Limiting
- **Global:** 1000 requests per 15 minutes per IP
- **Auth endpoints:** 5 requests per 15 minutes per IP
- **General endpoints:** 100 requests per 15 minutes per IP

### Account Security
- **Password Requirements:** Minimum 8 characters with uppercase, lowercase, number, and special character
- **Login Attempts:** Account locked for 2 hours after 5 failed attempts
- **Email Verification:** Required before account access
- **JWT Expiration:** 7 days (configurable)

### Security Headers
- Content Security Policy
- CORS configuration
- XSS Protection
- HSTS (when in production)

## Error Responses

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // For validation errors
}
```

## Success Responses

All success responses follow this format:
```json
{
  "success": true,
  "message": "Success description",
  "data": {} // Optional data
}
```

## Development

### File Structure
```
├── app.js              # Express app configuration
├── server.js           # Server entry point
├── config/
│   └── db.js          # Database configuration
├── controllers/
│   └── userController.js # User route handlers
├── middleware/
│   ├── auth.js        # Authentication middleware
│   ├── errorHandler.js # Error handling middleware
│   └── validation.js  # Input validation middleware
├── models/
│   └── user.js        # User MongoDB model
├── routes/
│   └── userRoutes.js  # User route definitions
└── utils/
    └── emailService.js # Email sending utilities
```

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure proper MongoDB URI
4. Set up email service credentials
5. Configure `CLIENT_URL` to your frontend domain
6. Consider using a reverse proxy (Nginx) for additional security

## License

ISC
