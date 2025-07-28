# Admin Dashboard Integration Setup

This guide will help you set up and run the admin dashboard with backend integration.

## Prerequisites

1. Node.js (v16 or higher)
2. MongoDB running locally or a cloud MongoDB instance
3. Backend server running (from the `backend` folder)

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017
   DB_NAME=codex_db
   ACCESS_TOKEN_SECRET=your_access_token_secret_here
   REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
   CORS_ORIGIN=http://localhost:3000
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd codex
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the codex directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Admin Access

1. First, you need to create an admin account. You can do this by making a POST request to the backend:

   ```bash
   curl -X POST http://localhost:5000/api/admin/signup \
     -H "Content-Type: application/json" \
     -d '{
       "regNumber": "ADMIN001",
       "fullName": "Admin User",
       "email": "admin@codex.com",
       "password": "admin123"
     }'
   ```

2. Or you can add this endpoint to your backend temporarily to create an admin from the frontend.

3. Access the admin login page at: `http://localhost:3000/admin/login`

4. Use the credentials you created to log in.

## Features Implemented

### ✅ Completed
- Admin authentication (login/logout)
- Event management (create, read, delete)
- Real-time data fetching from backend
- Protected admin routes
- Toast notifications
- Loading states
- Responsive design

### 🔄 In Progress
- Event editing functionality
- User management (when backend endpoints are added)
- Announcement system
- Project management

### 📋 To Do
- Add user management endpoints to backend
- Implement event editing
- Add image upload for events
- Add analytics dashboard
- Implement announcement system

## API Endpoints Used

### Admin
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `POST /api/admin/signup` - Admin registration

### Events
- `GET /api/event/events` - Get all events
- `POST /api/event/events` - Create new event
- `DELETE /api/event/events/:id` - Delete event
- `PATCH /api/event/events/:id` - Update event

## Troubleshooting

1. **CORS Issues**: Make sure your backend CORS_ORIGIN is set to `http://localhost:3000`

2. **Database Connection**: Ensure MongoDB is running and accessible

3. **Port Conflicts**: Make sure ports 3000 (frontend) and 5000 (backend) are available

4. **Authentication Issues**: Check that your JWT tokens are being set correctly in cookies

## File Structure

```
codex/
├── src/
│   ├── app/
│   │   └── admin/
│   │       ├── login/
│   │       │   └── page.jsx          # Admin login page
│   │       └── page.jsx              # Protected admin dashboard
│   ├── Components/
│   │   └── AdminDashboard.jsx        # Main admin dashboard component
│   ├── context/
│   │   └── AdminContext.js           # Admin authentication context
│   └── services/
│       └── api.js                    # API service functions
```

## Next Steps

1. Add user management functionality
2. Implement event editing
3. Add more admin features
4. Enhance the UI/UX
5. Add analytics and reporting 