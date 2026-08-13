# Project 2 Backend API Development

## Project Description
This project is a simple User Management REST API built with Node.js and Express.js. It demonstrates backend API development, request handling, response handling, basic validation, and HTTP status codes.

## Project Objective
The objective is to show how a frontend can communicate with a backend API using GET and POST requests, while the server validates input and returns structured JSON responses.

## Technologies Used
- Node.js
- Express.js
- JavaScript
- REST API
- JSON

## Features
- GET endpoint to retrieve users
- POST endpoint to create a user
- Basic server-side validation
- Structured success and error responses
- HTTP status code handling
- Simple frontend for API testing
- In-memory data storage

## Project Structure
```text
project-2-backend-api/
├── server/
│   ├── server.js
│   ├── routes/
│   │   └── userRoutes.js
│   ├── controllers/
│   │   └── userController.js
│   ├── middleware/
│   │   └── validation.js
│   └── data/
│       └── users.js
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
├── package.json
├── .gitignore
└── README.md
```

## Installation
```bash
npm install
```

## Start Server
```bash
npm start
```

Optional development command:
```bash
npm run dev
```

## API Endpoints
### GET /api/users
Retrieves all users.

Example response:
```json
{
   "success": true,
   "message": "Users retrieved successfully",
   "data": [
      {
         "id": 1,
         "name": "Daud",
         "email": "daud@example.com"
      }
   ]
}
```

### POST /api/users
Creates a new user.

Request body:
```json
{
   "name": "Daud",
   "email": "daud@example.com"
}
```

Example response:
```json
{
   "success": true,
   "message": "User created successfully",
   "data": {
      "id": 2,
      "name": "Daud",
      "email": "daud@example.com"
   }
}
```

## Validation Examples
Missing name or email:
```json
{
   "success": false,
   "message": "Name and email are required"
}
```

Invalid email:
```json
{
   "success": false,
   "message": "Please provide a valid email address"
}
```

## HTTP Status Codes
- 200: Successful GET request
- 201: Successful user creation
- 400: Invalid user input or invalid JSON
- 404: Unknown route
- 500: Unexpected server error

## Testing Instructions
- Browser: open `http://localhost:3000` and click `Load Users`
- Postman or Thunder Client: use `GET http://localhost:3000/api/users`
- Postman or Thunder Client: use `POST http://localhost:3000/api/users` with JSON body

Example POST request:
```json
{
   "name": "Daud",
   "email": "daud@example.com"
}
```

## Limitations
- Data is stored in memory only and resets when the server restarts
- The project intentionally avoids databases and authentication

## Learning Outcomes
- REST API basics
- GET and POST request handling
- Server-side validation
- JSON response design
- HTTP status code usage
- Frontend-to-backend communication
