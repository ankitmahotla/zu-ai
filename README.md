# zu-ai

This is a blog application built with Node.js, Express, MongoDB, and TypeScript, featuring user authentication and comment functionality.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v14 or later)

### Installation

1. Clone the repository: git clone git@github.com:ankitmahotla/zu-ai.git
2. Navigate to the project directory: cd zu-ai
4. Create a `.env` file in the backend directory and add the following:
DATABASE_URL=""
PORT=
ACCESS_TOKEN_SECRET=""
ACCESS_TOKEN_EXPIRY=""
REFRESH_TOKEN_SECRET=""
REFRESH_TOKEN_EXPIRY=""
5. Build the TypeScript code in backend: npm run build
6. Start the server: npm run start
7. Go to `frontend/src/api` and change baseUrl to: 'http://localhost:3000/api'
8. Run your frontend dev server: npm run dev

## API Endpoints

### User Routes

- `POST /api/users/register`: Register a new user
- `POST /api/users/login`: Login a user
- `POST /api/users/refreshToken`: Refresh access token
- `GET /api/users/check-username`: Check if a username is available

### Blog Routes

- `GET /api/blogs`: Get all blogs
- `GET /api/blogs/searchBlog`: Search blogs by title or content
- `GET /api/blogs/:id`: Get a specific blog
- `POST /api/blogs`: Create a new blog (requires authentication)
- `PUT /api/blogs/:id`: Update a blog (requires authentication)
- `DELETE /api/blogs/:id`: Delete a blog (requires authentication)

### Comment Routes

- `GET /api/comments`: Get all comments
- `POST /api/comments`: Create a new comment (requires authentication)
- `PUT /api/comments/:id`: Update a comment (requires authentication)
- `DELETE /api/comments/:id`: Delete a comment (requires authentication)

## Authentication

This application uses JWT (JSON Web Tokens) for authentication. Many routes require a valid JWT to be included in the Authorization header of the request.

## Built With

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [TypeScript](https://www.typescriptlang.org/)

