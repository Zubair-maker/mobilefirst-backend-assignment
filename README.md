<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

NestJS backend application with MySQL database and Prisma ORM.

## Prerequisites

- Node.js (v18 or higher)
- MySQL database (local setup)
- npm or yarn

## Project setup

1. Install dependencies:
```bash
$ npm install
```

2. Configure your database connection and environment variables:
   - Create a `.env` file in the root directory
   - Add the following environment variables:
   ```
   DATABASE_URL="mysql://user:password@localhost:3306/database_name"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   JWT_EXPIRES_IN="15m"
   JWT_REFRESH_SECRET="your-super-secret-refresh-jwt-key-change-this-in-production"
   JWT_REFRESH_EXPIRES_IN="7d"
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT=587
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"
   SMTP_FROM="noreply@example.com"
   APP_URL="http://localhost:3000"
   PORT=3000
   ```
   Replace the values with your actual credentials:
   - `DATABASE_URL`: Your MySQL connection string
   - `JWT_SECRET`: A strong random string for JWT access token signing (short-lived, default: 15 minutes)
   - `JWT_REFRESH_SECRET`: A strong random string for JWT refresh token signing (long-lived, default: 7 days)
   - `JWT_EXPIRES_IN`: Access token expiration time (default: "15m")
   - `JWT_REFRESH_EXPIRES_IN`: Refresh token expiration time (default: "7d")
   - `SMTP_USER` and `SMTP_PASS`: Your email credentials (for Gmail, use an App Password)
   - `APP_URL`: Your application URL (for password reset links)

3. Generate Prisma Client:
```bash
$ npm run prisma:generate
```

4. Run database migrations:
```bash
$ npm run prisma:migrate
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Prisma Commands

```bash
# Generate Prisma Client
$ npm run prisma:generate

# Create and apply migrations
$ npm run prisma:migrate

# Deploy migrations (production)
$ npm run prisma:migrate:deploy

# Open Prisma Studio (database GUI)
$ npm run prisma:studio

# Format Prisma schema
$ npm run prisma:format
```

## Project Structure

```
src/
├── auth/
│   ├── dto/                 # Data Transfer Objects for validation
│   │   ├── signup.dto.ts
│   │   ├── login.dto.ts
│   │   ├── verify-email.dto.ts
│   │   ├── forgot-password.dto.ts
│   │   └── reset-password.dto.ts
│   ├── guards/              # Authentication guards
│   │   └── jwt-auth.guard.ts
│   ├── strategies/          # Passport strategies
│   │   └── jwt.strategy.ts
│   ├── decorators/          # Custom decorators
│   │   └── get-user.decorator.ts
│   ├── auth.controller.ts  # Authentication endpoints
│   ├── auth.service.ts     # Authentication business logic
│   ├── auth.module.ts      # Authentication module
│   └── email.service.ts    # Email service for OTP and password reset
├── prisma/
│   ├── prisma.service.ts    # Prisma service for database operations
│   └── prisma.module.ts     # Global Prisma module
├── users/
│   ├── users.controller.ts  # Users REST API endpoints
│   ├── users.service.ts     # Users business logic
│   └── users.module.ts      # Users module
├── properties/
│   ├── dto/                 # Data Transfer Objects for validation
│   │   └── filter-properties.dto.ts
│   ├── properties.controller.ts  # Properties REST API endpoints
│   ├── properties.service.ts     # Properties business logic
│   └── properties.module.ts      # Properties module
├── app.module.ts            # Root application module
└── main.ts                  # Application entry point

prisma/
├── schema.prisma            # Prisma schema (database models)
└── migrations/              # Database migrations
```

## API Endpoints

### Authentication Endpoints

- `POST /auth/signup` - Register a new user (requires email, password, name)
- `POST /auth/login` - Login with email and password (returns access token and refresh token)
- `POST /auth/refresh` - Refresh access token using refresh token
- `POST /auth/verify-email` - Verify email with OTP (4-digit code sent via email)
- `POST /auth/forgot-password` - Request password reset (sends reset link via email)
- `POST /auth/reset-password` - Reset password with token and new password
- `POST /auth/resend-otp` - Resend OTP for email verification
- `POST /auth/logout` - Logout (requires JWT token in Authorization header, invalidates refresh token)

### Users Endpoints

- `POST /users` - Create a new user
- `GET /users` - Get all users
- `GET /users/:id` - Get a user by ID
- `PATCH /users/:id` - Update a user
- `DELETE /users/:id` - Delete a user

### Properties Endpoints

- `POST /properties` - Get all properties with filtering and pagination
- `GET /properties/:id` - Get a single property by ID

#### Get Property by ID

**Endpoint:** `GET http://localhost:3000/properties/:id`

**URL Parameters:**
- `id` - Property ID (integer)

**Example Request:**
```
GET http://localhost:3000/properties/1
```

**Response Format (Success - 200 OK):**

```json
{
  "id": 1,
  "title": "The Central Downtown Tower C",
  "location": "The Central Downtown Tower C, The Central, Dubai",
  "price": "2500000.00",
  "bedrooms": 2,
  "bathrooms": 2,
  "size": 1200,
  "description": "Luxury apartment in the heart of Downtown Dubai.",
  "community": "The Central",
  "balcony": true,
  "type": "Apartment",
  "purpose": "For Sale",
  "referenceNo": "Bayut-000001-abc123",
  "completion": "Off-Plan",
  "furnishing": "Unfurnished",
  "addedOn": "2024-11-25T10:00:00.000Z",
  "handoverDate": "Q1 2028",
  "developer": "DUBAI CREEK HARBOUR",
  "ownership": "Freehold",
  "builtUpArea": 1200,
  "usage": "Residential",
  "balconySize": 99,
  "parkingAvailability": true,
  "buildingName": "The Central Downtown Tower C",
  "totalFloors": 58,
  "swimmingPools": 2,
  "totalParkingSpaces": 604,
  "totalBuildingArea": "1178742.00",
  "elevators": 8,
  "images": [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop"
  ],
  "createdAt": "2024-11-27T08:10:18.000Z",
  "updatedAt": "2024-11-27T08:10:18.000Z"
}
```

**Response Format (Error - 404 Not Found):**

```json
{
  "statusCode": 404,
  "message": "Property with ID 999 not found",
  "error": "Not Found"
}
```

**Testing in Postman:**

1. Open Postman
2. Create a new GET request
3. Enter URL: `http://localhost:3000/properties/1` (replace `1` with the actual property ID)
4. Click "Send"
5. You should receive the property details or a 404 error if the property doesn't exist

**Common Response Status Codes:**

- `200 OK` - Property found and returned
- `400 Bad Request` - Invalid ID format (must be a number)
- `404 Not Found` - Property with the given ID does not exist

#### Properties API Details (Filter & Pagination)

**Endpoint:** `POST http://localhost:3000/properties`

**Request Body (JSON):** All fields are optional. If no filters are provided, all properties are returned.

```json
{
  "purpose": "Buy",           // "Buy" or "Rent" (maps to "For Sale" or "For Rent")
  "completion": "Ready",      // "All", "Ready", or "Off-Plan"
  "type": "Apartment",        // Property type: "Apartment", "Villa", "Townhouse", "Penthouse", "Studio"
  "bedrooms": 2,              // Number of bedrooms (integer)
  "bathrooms": 2,             // Number of bathrooms (integer)
  "minPrice": 1000000,        // Minimum price (number)
  "maxPrice": 5000000,         // Maximum price (number)
  "location": "Dubai",        // Location search (partial match, case-insensitive)
  "page": 1,                  // Page number (default: 1)
  "limit": 10                 // Items per page (default: 10)
}
```

**Response Format:**

```json
{
  "data": [
    {
      "id": 1,
      "title": "The Central Downtown Tower C",
      "location": "The Central Downtown Tower C, The Central, Dubai",
      "price": "2500000.00",
      "bedrooms": 2,
      "bathrooms": 2,
      "size": 1200,
      "description": "Luxury apartment in the heart of Downtown Dubai.",
      "community": "The Central",
      "balcony": true,
      "type": "Apartment",
      "purpose": "For Sale",
      "referenceNo": "Bayut-000001-abc123",
      "completion": "Off-Plan",
      "furnishing": "Unfurnished",
      "addedOn": "2024-11-25T10:00:00.000Z",
      "handoverDate": "Q1 2028",
      "developer": "DUBAI CREEK HARBOUR",
      "ownership": "Freehold",
      "builtUpArea": 1200,
      "usage": "Residential",
      "balconySize": 99,
      "parkingAvailability": true,
      "buildingName": "The Central Downtown Tower C",
      "totalFloors": 58,
      "swimmingPools": 2,
      "totalParkingSpaces": 604,
      "totalBuildingArea": "1178742.00",
      "elevators": 8,
      "images": [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop"
      ],
      "createdAt": "2024-11-27T08:10:18.000Z",
      "updatedAt": "2024-11-27T08:10:18.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

#### Testing with Postman

**Step 1: Start the Server**
```bash
npm run start:dev
```
The server will run on `http://localhost:3000` (or the port specified in your `.env` file).

**Step 2: Create a New Request in Postman**

1. Open Postman
2. Click "New" → "HTTP Request"
3. Set the method to **POST**
4. Enter the URL: `http://localhost:3000/properties`

**Step 3: Configure Request Headers**

1. Go to the "Headers" tab
2. Add the following header:
   - Key: `Content-Type`
   - Value: `application/json`

**Step 4: Add Request Body**

1. Go to the "Body" tab
2. Select "raw"
3. Choose "JSON" from the dropdown
4. Add your filter JSON (see examples below)

**Example Requests:**

**Example 1: Get All Properties (No Filters)**
```json
{
  "page": 1,
  "limit": 10
}
```

**Example 2: Filter by Buy/Rent (Purpose)**
```json
{
  "purpose": "Buy",
  "page": 1,
  "limit": 10
}
```

**Example 3: Filter by Completion Status**
```json
{
  "completion": "Ready",
  "page": 1,
  "limit": 10
}
```

**Example 4: Filter by Property Type**
```json
{
  "type": "Apartment",
  "page": 1,
  "limit": 10
}
```

**Example 5: Filter by Bedrooms and Bathrooms**
```json
{
  "bedrooms": 2,
  "bathrooms": 2,
  "page": 1,
  "limit": 10
}
```

**Example 6: Filter by Price Range**
```json
{
  "minPrice": 1000000,
  "maxPrice": 5000000,
  "page": 1,
  "limit": 10
}
```

**Example 7: Filter by Location**
```json
{
  "location": "Dubai",
  "page": 1,
  "limit": 10
}
```

**Example 8: Combined Filters (Complex Query)**
```json
{
  "purpose": "Buy",
  "completion": "Ready",
  "type": "Apartment",
  "bedrooms": 2,
  "bathrooms": 2,
  "minPrice": 1000000,
  "maxPrice": 5000000,
  "location": "Dubai",
  "page": 1,
  "limit": 20
}
```

**Example 9: Pagination**
```json
{
  "page": 2,
  "limit": 5
}
```

**Step 5: Send the Request**

Click the "Send" button. You should receive a response with:
- `data`: Array of property objects matching your filters
- `pagination`: Pagination metadata

**Filter Mapping Reference:**

| UI Filter | API Field | Database Column | Values |
|-----------|-----------|-----------------|---------|
| Buy/Rent | `purpose` | `purpose` | `"Buy"` → `"For Sale"`, `"Rent"` → `"For Rent"` |
| All/Ready/Off-Plan | `completion` | `completion` | `"All"`, `"Ready"`, `"Off-Plan"` |
| Residential/Type | `type` | `type` | `"Apartment"`, `"Villa"`, `"Townhouse"`, `"Penthouse"`, `"Studio"` |
| Beds | `bedrooms` | `bedrooms` | Integer (e.g., `1`, `2`, `3`, `4`, `5`) |
| Baths | `bathrooms` | `bathrooms` | Integer (e.g., `1`, `2`, `3`, `4`) |
| Price | `minPrice`, `maxPrice` | `price` | Numbers (e.g., `1000000`, `5000000`) |
| Location | `location` | `location` | String (partial match, case-insensitive) |

**Common Response Status Codes:**

- `200 OK` - Request successful
- `400 Bad Request` - Invalid request body or validation error
- `500 Internal Server Error` - Server error

**Tips:**

1. **Empty Request Body**: You can send an empty JSON object `{}` to get all properties with default pagination (page 1, limit 10).

2. **Pagination**: Use `page` and `limit` to navigate through results. The response includes `hasNextPage` and `hasPreviousPage` to help with UI pagination.

3. **Combining Filters**: You can combine multiple filters. All filters are applied with AND logic (all conditions must match).

4. **Location Search**: The location filter uses partial matching, so searching for "Dubai" will match "Dubai Marina", "Downtown Dubai", etc.

5. **Price Filter**: You can use `minPrice` alone, `maxPrice` alone, or both together for a price range.

### Authentication Flow

1. **Signup**: User registers with email, password, and name. An OTP is sent to their email.
2. **Email Verification**: User verifies their email using the 4-digit OTP.
3. **Login**: User logs in with email and password. Returns both access token (short-lived) and refresh token (long-lived).
4. **Protected Routes**: Include the access token in the Authorization header: `Bearer <access_token>`
5. **Token Refresh**: When access token expires, use the refresh token at `/auth/refresh` endpoint to get new access and refresh tokens.
6. **Forgot Password**: User requests password reset. A reset link is sent to their email.
7. **Reset Password**: User resets password using the token from the email.
8. **Logout**: User logs out (invalidates refresh token server-side, client should also remove tokens).

## Notes

- Prisma Client automatically reads the `DATABASE_URL` from your `.env` file
- After modifying the Prisma schema, run `npm run prisma:migrate` to create and apply migrations
- The Prisma module is global, so you can inject `PrismaService` into any module without importing it

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
