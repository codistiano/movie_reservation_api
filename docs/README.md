# Movie Reservation API

A RESTful API for movie ticket reservations built with Node.js, Express, and MongoDB.

## Table of Contents

- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [API Usage Examples](#api-usage-examples)
- [Deployment](#deployment)

## Features

- User authentication and authorization
- Movie management
- Showtime scheduling
- Seat reservation system
- User profile management
- Admin dashboard

## Setup Instructions

1. Clone the repository:

```bash
git clone <repository-url>
cd movie_reservation_api
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables (see [Environment Variables](#environment-variables))

4. Seed the database (optional):

```bash
node seed.js
```

5. Start the development server:

```bash
npm run dev
```

6. Start the production server:

```bash
npm start
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/movie_reservation
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

- `PORT`: The port number for the server (default: 3000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRES_IN`: JWT token expiration time
- `NODE_ENV`: Environment mode (development/production)

## API Documentation

The API documentation is available at `/api-docs` when the server is running. It provides detailed information about:

- Available endpoints
- Request/response formats
- Authentication requirements
- Error codes and messages

### Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Base URL

```
http://localhost:3000/api
```

### Endpoints

#### Auth

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password

#### Movies

- `GET /movies` - Get all movies
- `GET /movies/:id` - Get movie by ID
- `GET /movies/:id/showtimes` - Get showtimes for a movie

#### Showtimes

- `GET /showtimes` - Get all showtimes
- `GET /showtimes/:id` - Get showtime by ID
- `GET /showtimes/:id/seats` - Get available seats

#### Reservations

- `POST /reservations` - Create a new reservation
- `GET /reservations` - Get user's reservations
- `GET /reservations/:id` - Get reservation by ID
- `PATCH /reservations/:id/cancel` - Cancel reservation

#### User Profile

- `GET /profile` - Get user profile
- `PATCH /profile` - Update user profile
- `PATCH /profile/password` - Change password

## API Usage Examples

### Register a New User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get All Movies

```bash
curl -X GET http://localhost:3000/api/movies \
  -H "Authorization: Bearer <token>"
```

### Create Reservation

```bash
curl -X POST http://localhost:3000/api/reservations \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "showtime": "showtime_id",
    "seats": ["A1", "A2"]
  }'
```

## Deployment

The API is deployed on Render. To deploy your own instance:

1. Create a Render account
2. Create a new Web Service
3. Connect your GitHub repository
4. Configure the following:

   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables:
     ```
     PORT=3000
     MONGODB_URI=<your-mongodb-uri>
     JWT_SECRET=<your-jwt-secret>
     JWT_EXPIRES_IN=7d
     NODE_ENV=production
     ```

5. Deploy!

The API will be available at your Render URL.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
