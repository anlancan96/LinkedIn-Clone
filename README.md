
# LinkedIn Clone
This project is intended for practices and studies.

## Roadmap for backend development
###  Implement Authentication System
- [x]  User Signup with hashed passwords (bcrypt)
- [x]  User Login with JWT authentication
- [x]  Implement refresh tokens for session persistence
- [x]  Middleware to protect routes (auth middleware)
### User Profile Features
- [ ]  Create User Profile Model (Name, Bio, Experience, Profile Picture)
- [ ]  Implement Profile Update API
- [ ]  Store profile images using Cloudinary/Firebase Storage
### Follow/Unfollow System
- [ ]  Implement Follow/Unfollow API Track followers and following users in the database
### Post System
- [ ]  Create Post Model (Text, Image, Video, User ID, Timestamps)
- [ ]  Implement Create Post API
- [ ]  Implement Delete Post API
- [ ]  Store images/videos using Cloudinary
### News Feed System
- [ ]  Fetch posts from followed users only
- [ ]  Implement Pagination (Infinite Scroll)
### Like & Comment System
- [ ]  Implement Like API
- [ ]  Implement Comment API
### Real-Time Notifications
- [ ]  Implement Notification Model
- [ ]  Notify users when they get followed, liked, commented, or messaged
- [ ]  Use WebSockets for real-time notifications
### Performance & Security Optimizations
- [x]  Implement Rate Limiting (to prevent spam requests)
- [x]  Optimize database queries with indexes (under developing)
- [ ]  Implement Redis caching for frequently accessed data
### Security & Optimization
- [x]  Implement CORS & Helmet for security
- [ ]  Set up SSL (HTTPS)
- [x]  Implement Logging & Error Tracking
### Deployment Steps
- [ ]  Deploy Backend on Render/Heroku/AWS
- [ ]  Deploy Database on MongoDB Atlas or Railway
- [ ]  Configure environment variables securely
