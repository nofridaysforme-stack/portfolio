# Quick Start Guide

This guide will help you get your portfolio site running quickly.

## Prerequisites

1. **Node.js 18+** - [Download here](https://nodejs.org/)
2. **MongoDB** - Choose one:
   - Local installation: [Download MongoDB](https://www.mongodb.com/try/download/community)
   - Cloud: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier available)
3. **Firebase Project** - [Create one here](https://console.firebase.google.com/)

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and update:

**Required for basic functionality:**
```env
PAYLOAD_SECRET=your-random-secret-key-at-least-32-chars
MONGODB_URI=mongodb://localhost:27017/portfolio
```

**For Firebase (optional, for media storage):**
- Get your Firebase config from Firebase Console → Project Settings
- Update all `NEXT_PUBLIC_FIREBASE_*` values

### 3. Start MongoDB

**Option A: Local MongoDB**
```bash
mongod
```

**Option B: MongoDB Atlas**
- Create a cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get connection string and update `MONGODB_URI` in `.env`

### 4. Create Admin User

```bash
npm run seed
```

This creates an admin user with:
- **Email**: `admin@example.com`
- **Password**: `admin123`

⚠️ **Change this password after first login!**

### 5. Start Development Server

```bash
npm run dev
```

The server will start on [http://localhost:3000](http://localhost:3000)

### 6. Access Admin Panel

Open [http://localhost:3000/admin](http://localhost:3000/admin)

Login with:
- **Email**: `admin@example.com`
- **Password**: `admin123`

## What's Included

### Collections
- **Users** - Admin and editor accounts
- **Media** - Image and file management with automatic resizing

### API Endpoints
- **REST API**: `http://localhost:3000/api/*`
- **GraphQL API**: `http://localhost:3000/api/graphql`
- **GraphQL Playground**: `http://localhost:3000/api/graphql-playground`

## Next Steps

1. **Change admin password** after first login
2. **Add Firebase credentials** to enable media storage
3. **Create new collections** in `src/payload/collections/`
4. **Build components** in `src/components/`
5. **Add pages** in `src/app/`

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod --version`
- Check `MONGODB_URI` in `.env`
- For Atlas, ensure your IP is whitelisted

### Payload Secret Error
- Ensure `PAYLOAD_SECRET` is at least 32 characters
- Use a strong random string

### Port Already in Use
- Change port: `PORT=3001 npm run dev`
- Or kill process using port 3000

## Useful Commands

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run seed             # Create admin user
npm run generate:types   # Generate TypeScript types
npm run lint             # Run ESLint
```

## Need Help?

Check the main [README.md](./README.md) for detailed documentation.
