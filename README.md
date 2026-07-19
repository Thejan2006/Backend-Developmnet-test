# i-Computers Backend API

A Node.js backend API built with Express.js and MongoDB for an e-commerce platform. This API handles user authentication, product management, and order processing.

## Features

- ✅ User authentication with JWT and bcrypt password hashing
- ✅ User registration and login
- ✅ Product management (CRUD operations)
- ✅ Order management and processing
- ✅ OTP-based email verification
- ✅ Protected routes with authentication middleware
- ✅ CORS enabled for cross-origin requests
- ✅ Environment variable configuration

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js (v5.2.1)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcrypt
- **Email**: Nodemailer
- **HTTP Client**: Axios
- **Development**: Nodemon (auto-reload on file changes)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Backend-Developmnet-test
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** in the root directory
   ```bash
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
   ```

## Project Structure

```
.
├── index.js                 # Application entry point
├── controllers/             # Route controllers (business logic)
│   ├── userController.js
│   ├── productController.js
│   └── orderController.js
├── routers/                 # Route definitions
│   ├── userRouter.js
│   ├── productRouter.js
│   └── orderRouter.js
├── models/                  # Mongoose schemas
│   ├── user.js
│   ├── product.js
│   ├── order.js
│   └── otp.js
├── middlewares/             # Express middlewares
│   └── authenticate.js
├── package.json             # Project dependencies
└── README.md                # This file
```

## Getting Started

1. **Start the server**
   ```bash
   npm start
   ```
   The server will run on `http://localhost:3003`

2. **Expected output**
   ```
   Connected with MongoDB successfully
   Server started successfully on port 3003
   ```

## API Endpoints

### Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - User login
- `GET /api/users/:id` - Get user details (protected)
- `PUT /api/users/:id` - Update user details (protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create new product (protected)
- `PUT /api/products/:id` - Update product (protected)
- `DELETE /api/products/:id` - Delete product (protected)

### Orders
- `POST /api/orders` - Create new order (protected)
- `GET /api/orders/:id` - Get order details (protected)
- `GET /api/orders/user/:userId` - Get user orders (protected)
- `PUT /api/orders/:id` - Update order status (protected)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Protected routes require a valid JWT token in the request headers:

```
Authorization: Bearer <token>
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Server Port (optional - defaults to 3003)
PORT=3003

# JWT Secret (optional - if needed)
JWT_SECRET=your-secret-key

# Email Configuration (optional - for OTP/Email features)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## Development

### Running with Auto-Reload
The project uses **Nodemon** for automatic server restart during development:

```bash
npm start
```

### Dependencies Details
- **express**: Web framework for routing and middleware
- **mongoose**: MongoDB object modeling
- **jwt**: Authentication tokens
- **bcrypt**: Password hashing and security
- **cors**: Cross-Origin Resource Sharing
- **dotenv**: Environment variable management
- **nodemailer**: Email sending service
- **axios**: HTTP client for external APIs

## Error Handling

The API uses standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected routes with authentication middleware
- CORS configuration for secure cross-origin requests
- Environment variables for sensitive data

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

ISC

## Support

For issues or questions, please create an issue in the repository.
