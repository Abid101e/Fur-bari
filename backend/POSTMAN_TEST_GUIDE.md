# Fur-Bari Backend API - Postman Testing Guide

## Base URL

```
http://localhost:5000
```

## API Base URL

```
http://localhost:5000/api/v1
```

---

## 🔍 **1. HEALTH CHECK ENDPOINTS**

### Health Check

- **Method**: `GET`
- **URL**: `http://localhost:5000/health`
- **Expected Response**: 200 OK

```json
{
  "success": true,
  "message": "Farbari API is healthy",
  "timestamp": "2025-08-17T01:54:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

### Root API Info

- **Method**: `GET`
- **URL**: `http://localhost:5000/`
- **Expected Response**: 200 OK

```json
{
  "success": true,
  "message": "Farbari Pet Adoption API",
  "version": "1.0.0",
  "documentation": "/api/v1/docs",
  "endpoints": {
    "auth": "/api/v1/auth",
    "users": "/api/v1/users",
    "posts": "/api/v1/posts",
    "interests": "/api/v1/interests"
  }
}
```

---

## 🔐 **2. AUTHENTICATION ENDPOINTS**

### Register User

- **Method**: `POST`
- **URL**: `http://localhost:5000/api/v1/auth/register`
- **Headers**:
  ```
  Content-Type: application/json
  ```
- **Body** (raw JSON):

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "phone": "+1234567890",
  "location": {
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "coordinates": {
      "latitude": 40.7128,
      "longitude": -74.006
    }
  }
}
```

### Login User

- **Method**: `POST`
- **URL**: `http://localhost:5000/api/v1/auth/login`
- **Headers**:
  ```
  Content-Type: application/json
  ```
- **Body** (raw JSON):

```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

### Get Current User (Protected)

- **Method**: `GET`
- **URL**: `http://localhost:5000/api/v1/auth/me`
- **Headers**:
  ```
  Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
  ```

### Refresh Token

- **Method**: `POST`
- **URL**: `http://localhost:5000/api/v1/auth/refresh`
- **Headers**:
  ```
  Content-Type: application/json
  ```
- **Body** (raw JSON):

```json
{
  "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
}
```

### Logout

- **Method**: `POST`
- **URL**: `http://localhost:5000/api/v1/auth/logout`
- **Headers**:
  ```
  Content-Type: application/json
  ```
- **Body** (raw JSON):

```json
{
  "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
}
```

### Send Verification Email (Protected)

- **Method**: `POST`
- **URL**: `http://localhost:5000/api/v1/auth/verify-email`
- **Headers**:
  ```
  Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
  ```

### Forgot Password

- **Method**: `POST`
- **URL**: `http://localhost:5000/api/v1/auth/forgot-password`
- **Headers**:
  ```
  Content-Type: application/json
  ```
- **Body** (raw JSON):

```json
{
  "email": "john.doe@example.com"
}
```

---

## 👤 **3. USER ENDPOINTS**

### Get Current User Profile (Protected)

- **Method**: `GET`
- **URL**: `http://localhost:5000/api/v1/users/me`
- **Headers**:
  ```
  Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
  ```

### Update User Profile (Protected)

- **Method**: `PATCH`
- **URL**: `http://localhost:5000/api/v1/users/me`
- **Headers**:
  ```
  Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
  Content-Type: application/json
  ```
- **Body** (raw JSON):

```json
{
  "name": "John Updated",
  "bio": "Pet lover and animal advocate",
  "location": {
    "address": "456 Pet Street",
    "city": "Los Angeles",
    "state": "CA",
    "zipCode": "90210"
  },
  "preferences": {
    "emailNotifications": true,
    "smsNotifications": false,
    "newsletter": true
  }
}
```

### Get User by ID (Public)

- **Method**: `GET`
- **URL**: `http://localhost:5000/api/v1/users/{userId}`
- **Replace {userId} with actual user ID**

### Change Password (Protected)

- **Method**: `PATCH`
- **URL**: `http://localhost:5000/api/v1/users/change-password`
- **Headers**:
  ```
  Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
  Content-Type: application/json
  ```
- **Body** (raw JSON):

```json
{
  "currentPassword": "SecurePass123!",
  "newPassword": "NewSecurePass456!"
}
```

---

## 🐾 **4. POSTS (PET ADOPTION) ENDPOINTS**

### Create Pet Post (Protected)

- **Method**: `POST`
- **URL**: `http://localhost:5000/api/v1/posts`
- **Headers**:
  ```
  Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
  Content-Type: application/json
  ```
- **Body** (raw JSON):

```json
{
  "title": "Adorable Golden Retriever Looking for Home",
  "description": "Max is a 2-year-old golden retriever who loves playing fetch and cuddling.",
  "pet": {
    "name": "Max",
    "species": "dog",
    "breed": "Golden Retriever",
    "age": 2,
    "gender": "male",
    "size": "large",
    "color": "golden",
    "isVaccinated": true,
    "isNeutered": true,
    "healthStatus": "excellent",
    "temperament": ["friendly", "playful", "gentle"],
    "goodWith": ["children", "other-dogs"],
    "specialNeeds": []
  },
  "location": {
    "address": "123 Pet Shelter Ave",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  },
  "requirements": {
    "hasYard": true,
    "hasExperience": false,
    "hasOtherPets": false,
    "maxHoursAlone": 6
  },
  "contact": {
    "method": "email",
    "value": "contact@shelter.com"
  }
}
```

### Get All Posts (Public)

- **Method**: `GET`
- **URL**: `http://localhost:5000/api/v1/posts`
- **Query Parameters** (optional):
  ```
  ?species=dog&size=large&page=1&limit=10&city=New York
  ```

### Get Single Post by ID

- **Method**: `GET`
- **URL**: `http://localhost:5000/api/v1/posts/{postId}`
- **Replace {postId} with actual post ID**

### Get My Posts (Protected)

- **Method**: `GET`
- **URL**: `http://localhost:5000/api/v1/posts/my-posts`
- **Headers**:
  ```
  Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
  ```

### Update Post (Protected)

- **Method**: `PATCH`
- **URL**: `http://localhost:5000/api/v1/posts/{postId}`
- **Headers**:
  ```
  Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
  Content-Type: application/json
  ```
- **Body** (raw JSON):

```json
{
  "title": "Updated: Adorable Golden Retriever",
  "description": "Updated description for Max",
  "pet": {
    "age": 3
  }
}
```

### Toggle Favorite (Protected)

- **Method**: `POST`
- **URL**: `http://localhost:5000/api/v1/posts/{postId}/favorite`
- **Headers**:
  ```
  Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
  ```

### Get My Favorites (Protected)

- **Method**: `GET`
- **URL**: `http://localhost:5000/api/v1/posts/favorites`
- **Headers**:
  ```
  Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
  ```

---

## 💝 **5. INTERESTS (ADOPTION APPLICATIONS) ENDPOINTS**

### Create Adoption Application (Protected)

- **Method**: `POST`
- **URL**: `http://localhost:5000/api/v1/interests`
- **Headers**:
  ```
  Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
  Content-Type: application/json
  ```
- **Body** (raw JSON):

```json
{
  "postId": "POST_ID_HERE",
  "message": "I would love to adopt Max! I have experience with dogs and a big yard.",
  "applicantInfo": {
    "livingArrangement": "house",
    "hasYard": true,
    "hasExperience": true,
    "hasOtherPets": false,
    "hoursAlonePerDay": 4,
    "reasonForAdoption": "Looking for a loyal companion for my family"
  }
}
```

### Get My Applications (Protected)

- **Method**: `GET`
- **URL**: `http://localhost:5000/api/v1/interests/my-interests`
- **Headers**:
  ```
  Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
  ```

### Get Applications for My Post (Protected)

- **Method**: `GET`
- **URL**: `http://localhost:5000/api/v1/interests/post/{postId}`
- **Headers**:
  ```
  Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
  ```

### Update Application Status (Protected - Post Owner Only)

- **Method**: `PATCH`
- **URL**: `http://localhost:5000/api/v1/interests/{interestId}/status`
- **Headers**:
  ```
  Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
  Content-Type: application/json
  ```
- **Body** (raw JSON):

```json
{
  "status": "approved",
  "responseMessage": "We'd love to move forward with your application!"
}
```

---

## 🧪 **TESTING WORKFLOW**

### Step 1: Test Health Endpoints

1. Test `GET /health`
2. Test `GET /`

### Step 2: Test Authentication Flow

1. Register a new user
2. Login with the user
3. Copy the `accessToken` from login response
4. Test protected endpoints with the token

### Step 3: Test User Management

1. Get current user profile
2. Update user profile
3. Test password change

### Step 4: Test Posts Management

1. Create a pet post
2. Get all posts
3. Get the specific post
4. Update the post
5. Test favorites

### Step 5: Test Adoption Applications

1. Create an application for a post
2. Get your applications
3. Test status updates (if you're the post owner)

---

## 🚨 **EXPECTED RESPONSES**

### Success Response Format

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

### Validation Error Format

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

---

## 📝 **NOTES**

1. **Authentication**: Most endpoints require a Bearer token in the Authorization header
2. **Content-Type**: Always set to `application/json` for POST/PATCH requests
3. **Rate Limiting**: API has rate limiting (1000 requests per 15 minutes)
4. **Environment**: Server is running in development mode
5. **Database**: Connected to MongoDB Atlas

**Server Status**: ✅ Running on http://localhost:5000
