# NestJS Backend API

A robust backend API built with NestJS featuring JWT authentication, user management, movie catalog, and comprehensive Swagger documentation.

## ✅ Prerequisites

- Node.js (>= 18.x)
- npm or yarn
- Mongodb (or another supported database)

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone <https://github.com/pemaram/movie-app-backend.git>

cd nestjs-backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Update the .env file with your configuration
```

### Running the Application

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

---

## 📁 Project Structure

```
src/
  ├── auth/                 # Authentication module
  │   ├── strategies/       # JWT and other strategies
  │   ├── guards/           # Authentication guards
  │   └── decorators/       # Custom decorators
  ├── users/                # User management module
  │   ├── entities/         # User entity
  │   └── dto/              # Data transfer objects
  ├── movies/               # Movies module
  │   ├── entities/         # Movie entity
  │   ├── dto/              # Data transfer objects
  │   └── interfaces/       # Type interfaces
  ├── common/               # Shared resources
  │   ├── filters/          # Exception filters
  │   ├── interceptors/     # Response interceptors
  │   ├── middleware/       # Custom middleware
  │   └── decorators/       # Shared decorators
  ├── config/               # Configuration files
  ├── database/             # Database configuration and migrations
  └── main.ts               # Application entry point
```