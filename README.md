# CRUD Web Server

A RESTful web server built with Node.js and Express.js that provides complete CRUD (Create, Read, Update, Delete) operations for user management with cookie-based session authentication.

## Features

- **Session Management**: Cookie-based authentication with secure session handling
- **Full CRUD Operations**: Create, read, update, and delete users
- **RESTful API**: Clean API endpoints following REST conventions
- **Interactive Web Interface**: User-friendly HTML interface for all operations
- **Real-time Logging**: Comprehensive request/response logging for debugging
- **In-memory Storage**: Simple data persistence for development and testing

## Technology Stack

- **Backend**: Node.js, Express.js
- **Authentication**: Cookie-based sessions with UUID
- **Frontend**: HTML, CSS, JavaScript
- **Development**: Nodemon for hot reloading

## Project Structure

```
crud-webserver/
├── package.json          # Project dependencies and scripts
├── server.js            # Main server file with API routes
└── public/
    ├── index.html       # Main web interface
    ├── index.css        # Styling
    └── index.js         # Client-side JavaScript
```

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/prakharmi/crud-webserver.git
   cd crud-webserver
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   # Production mode
   npm start
   
   # Development mode (with auto-reload)
   npm run dev
   ```

4. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/login` | Create a new session | `{"username": "string"}` |
| POST | `/api/logout` | End current session | None |
| GET | `/api/session` | Get current session info | None |

### User Management (Requires Authentication)

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/users` | Create a new user | `{"name": "string", "email": "string", "age": number}` |
| GET | `/api/users` | Get all users | None |
| GET | `/api/users/:id` | Get user by ID | None |
| PUT | `/api/users/:id` | Update user | `{"name": "string", "email": "string", "age": number}` |
| DELETE | `/api/users/:id` | Delete user | None |

## Usage Examples

### Using the Web Interface

1. **Login**: Enter a username and click "Login"
2. **Create User**: Fill in the form and click "Create User"
3. **View Users**: Click "Refresh Users" to see all users
4. **Edit User**: Click "Edit" next to any user, modify details, and click "Update"
5. **Delete User**: Click "Delete" next to any user and confirm

### Using cURL

```bash
# Login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username": "prakhar"}' \
  -c cookies.txt

# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Prakhar Mishra", "email": "prakharmishraa30@gmail.com", "age": 21}' \
  -b cookies.txt

# Get all users
curl -X GET http://localhost:3000/api/users -b cookies.txt

# Update a user
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Prakhar Mishra", "email": "prakharmishraa30@gmail.com", "age": 31}' \
  -b cookies.txt

# Delete a user
curl -X DELETE http://localhost:3000/api/users/1 -b cookies.txt
```

## Configuration

The server runs on port 3000 by default. You can modify the port in `server.js`:

```javascript
const PORT = process.env.PORT || 3000;
```

## Security Features

- **HTTP-only Cookies**: Session cookies are HTTP-only to prevent XSS attacks
- **Session Expiration**: Sessions expire after 24 hours
- **Input Validation**: Server-side validation for all user inputs
- **Authentication Required**: All CRUD operations require valid session

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Development Mode

Run the server in development mode with auto-reload:

```bash
npm run dev
```

### Logging

The server provides comprehensive logging for all requests:

- Request method and URL
- Session information
- Request body (when present)
- Response status and data
- Success/error indicators

## Sample Data

The server comes with sample users for testing:

```javascript
[
  { id: 1, name: 'Prakhar', email: 'prakhar@example.com', age: 30 },
  { id: 2, name: 'Mishra', email: 'mishra@example.com', age: 25 },
  { id: 3, name: 'Prakhs', email: 'prakhs@example.com', age: 20 }
]
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `404` - Not Found (user doesn't exist)
- `500` - Internal Server Error

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Prakhar Mishra**

## Acknowledgments

- Built with Express.js framework
- Uses UUID for session management
- Responsive design with vanilla CSS
