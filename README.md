# Furbari - Pet Care Platform

A full-stack web application for pet care services with OAuth authentication support.

## 📁 Project Structure

```
Furbari/
├── backend/                    # Backend API server
│   ├── config/                # Configuration files
│   ├── controllers/           # Route controllers
│   ├── middleware/            # Custom middleware
│   ├── models/                # Database models
│   ├── routes/                # API routes
│   ├── uploads/               # File uploads
│   └── utils/                 # Utility functions
├── frontend/                  # Frontend application (if separate)
├── config/                    # Shared configuration
├── uploads/                   # File uploads directory
├── .vscode/                   # VS Code settings
│   ├── settings.json.example  # Recommended VS Code settings
│   └── extensions.json        # Recommended extensions
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── .dockerignore              # Docker ignore rules
├── app.js                     # Express app configuration
├── server.js                  # Server entry point
└── package.json               # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Furbari
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration values.

4. **VS Code Setup (Optional)**
   ```bash
   cp .vscode/settings.json.example .vscode/settings.json
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔧 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

## 🔐 Authentication

This application supports multiple authentication methods:

### Local Authentication
- Email/Password registration and login
- Email verification
- Password reset functionality

### OAuth Providers
- Google OAuth 2.0
- Facebook Login
- GitHub OAuth
- Twitter OAuth

### Setup OAuth Providers

1. **Google OAuth**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add your domain to authorized origins

2. **Facebook OAuth**
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create a new app
   - Set up Facebook Login product
   - Add your domain to valid OAuth redirect URIs

3. **GitHub OAuth**
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Create a new OAuth app
   - Set authorization callback URL

## 📝 Environment Variables

Key environment variables you need to configure:

### Database
- `MONGO_URI` - MongoDB connection string

### Server
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

### Authentication
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRE` - JWT expiration time

### OAuth Providers
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`
- `FACEBOOK_APP_ID` & `FACEBOOK_APP_SECRET`
- `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET`

### Email (for verification)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`

See `.env.example` for all available configuration options.

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- Input validation and sanitization
- CORS protection
- Helmet.js security headers
- Account lockout after failed attempts
- Email verification

## 📚 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/logout` - User logout
- `GET /api/users/verify-email/:token` - Email verification
- `POST /api/users/forgot-password` - Password reset request
- `PUT /api/users/reset-password/:token` - Password reset

### OAuth
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/facebook` - Facebook OAuth login
- `GET /api/auth/github` - GitHub OAuth login

### Protected Routes
- `GET /api/users/me` - Get current user
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password

## 🛠️ Development

### Code Style
- ESLint for linting
- Prettier for formatting
- Conventional commits recommended

### File Upload
- Multer for handling file uploads
- Size limits configured
- File type validation

### Error Handling
- Global error handler
- Custom error classes
- Proper HTTP status codes

## 📦 Deployment

### Docker Support
- Dockerfile included
- Docker Compose for local development
- Multi-stage builds for production

### Environment Specific Configs
- Development: Auto-reload, detailed logging
- Production: Optimized, security hardened

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🐛 Issues

If you encounter any issues, please report them on the GitHub issues page.
