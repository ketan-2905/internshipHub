# Internship Management Platform - Backend

This is the backend API for the Internship Management Platform, a system designed to help students find, bookmark, and manage internship opportunities.

## Features

- User authentication (signup, login) with JWT
- Internship listings management
- Bookmark system for saving internships
- Calendar events for internship deadlines and important dates
- Excel upload for bulk internship creation (admin only)
- Admin dashboard for managing internships

## Tech Stack

- Node.js
- Express.js
- MongoDB (via Mongoose ODM)
- JWT for authentication
- Multer / xlsx for Excel parsing
- bcrypt for password hashing

## Project Structure

```
backend/
├── controllers/
├── models/         # Database models
├── middleware/     # Auth middleware
├── routes/         # API routes
├── utils/          # Utility functions
├── config/         # Configuration files
├── uploads/        # Excel file uploads
├── .env            # Environment variables
├── server.js       # Entry point
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Authenticate user & get token
- `GET /api/auth/me` - Get current user profile

### Internships
- `GET /api/internships` - Get all internships
- `GET /api/internships/:id` - Get internship by ID
- `POST /api/internships` - Create a new internship (Admin only)
- `PUT /api/internships/:id` - Update an internship (Admin only)
- `DELETE /api/internships/:id` - Delete an internship (Admin only)

### Bookmarks
- `GET /api/bookmarks` - Get user's bookmarked internships
- `POST /api/bookmarks/toggle` - Toggle internship in user's bookmarks
- `GET /api/bookmarks/check/:id` - Check if an internship is bookmarked

### Calendar
- `GET /api/calendar/public` - Get all public calendar events
- `GET /api/calendar/private` - Get private calendar events for logged-in user
- `POST /api/calendar/events/:id` - Add a calendar event to an internship

### Excel Upload
- `POST /api/upload/excel` - Upload internships from Excel file (Admin only)

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/internships
   JWT_SECRET=your_jwt_secret
   ADMIN_EMAIL=ketangaikwad035@gmail.com
   ```
4. Start the server: `npm run dev`

## Admin Account

An admin account is automatically created on server start if it doesn't exist:

- Email: ketangaikwad035@gmail.com
- Password: ketan@D048

## Excel Upload Format

The Excel file for bulk internship upload should have the following columns:

- company (required)
- role (required)
- requirements (required)
- mode (required)
- stipend (required)
- deadline (required, date format)
- formLink (required)
- eventTitle (optional)
- eventDate (optional, date format)
- eventVisibility (optional, 'public' or 'private')