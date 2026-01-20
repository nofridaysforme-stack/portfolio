# Portfolio Site

A modern portfolio website built with Next.js 14, Payload CMS, and Firebase.

## Tech Stack

- **Next.js 14.1+** - React framework with App Router
- **TypeScript** - Type-safe development with strict mode
- **Payload CMS 2.8+** - Headless CMS for content management
- **MongoDB** - Database for Payload CMS
- **Firebase** - Authentication and media storage
- **Tailwind CSS** - Utility-first CSS framework
- **GSAP & Framer Motion** - Advanced animations
- **Sharp** - Image optimization

## Color Palette

- **Primary (Burnt Orange)**: #D97E3C
- **Secondary (Champagne Gold)**: #D4AF6A
- **Dark (Charcoal)**: #2D2D2D
- **Light (Warm Neutral)**: #F5F5F0

## Project Structure

```
portfolio/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   │   ├── ui/          # Reusable UI components
│   │   ├── blocks/      # Content blocks
│   │   ├── layout/      # Layout components
│   │   └── portfolio/   # Portfolio-specific components
│   ├── lib/             # Utilities and integrations
│   │   ├── firebase/    # Firebase SDK
│   │   ├── payload/     # Payload utilities
│   │   └── utils/       # Helper functions
│   ├── payload/         # Payload CMS configuration
│   │   ├── collections/ # Content collections
│   │   ├── blocks/      # Reusable blocks
│   │   ├── globals/     # Global settings
│   │   ├── fields/      # Reusable fields
│   │   └── hooks/       # Lifecycle hooks
│   └── styles/          # Global styles
├── public/              # Static assets
└── media/               # Uploaded media files

```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Firebase project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your actual credentials:
- MongoDB connection string
- Payload secret key (minimum 32 characters)
- Firebase configuration
- Firebase Admin SDK credentials
- Admin user credentials for seeding

4. **Start MongoDB** (if running locally):
```bash
# Make sure MongoDB is running on localhost:27017
# Or use MongoDB Atlas and update MONGODB_URI
```

5. **Create the first admin user**:
```bash
npm run seed
```

This will create an admin user with the credentials from your `.env` file. Default credentials:
- Email: `admin@example.com`
- Password: `admin123`

⚠️ **Important**: Change the password after your first login!

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Access the Payload admin panel at [http://localhost:3000/admin](http://localhost:3000/admin)

Login with your admin credentials to start managing content.

### Building for Production

```bash
npm run build
npm start
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Create the first admin user
- `npm run payload` - Run Payload CLI commands
- `npm run generate:types` - Generate TypeScript types from Payload collections

## Features

- 🎨 Modern, responsive design with Tailwind CSS
- 🖼️ Content management with Payload CMS
- 🔥 Firebase authentication and storage
- ⚡ Server-side rendering with Next.js 14
- 🎬 Smooth animations with GSAP and Framer Motion
- 📱 Mobile-first responsive design
- 🔍 SEO optimized
- 🎯 TypeScript for type safety
- 🎨 Custom color palette

## Configuration

### Tailwind CSS

Custom colors are configured in `tailwind.config.ts` with full shade variants (50-900).

### Payload CMS

Payload CMS is fully integrated with Next.js 14 App Router.

**Configuration Files:**
- `payload.config.ts` - Root configuration file (re-exports from src/payload)
- `src/payload/payload.config.ts` - Main Payload configuration
- `src/payload/collections/` - Content type definitions
  - `Users.ts` - User authentication with admin/editor roles
  - `Media.ts` - Media library with automatic image resizing
  - `Projects.ts` - Portfolio projects with full case study support

**Admin Panel:**
- Access at: [http://localhost:3000/admin](http://localhost:3000/admin)
- Custom branding: "Jana Portfolio CMS"
- MongoDB database adapter
- Slate rich text editor

**Collections:**
- **Users**: Email/password authentication with role-based access control
- **Media**: Image and file uploads with automatic resizing (thumbnail, card, tablet, desktop)
- **Projects**: Portfolio projects with categories, tech stack, metrics, and full case studies
  - Auto-generated slugs
  - Featured project flag for homepage
  - Rich text content with image gallery
  - Project links (live, GitHub, case study)
  - Technology stack tracking
  - Project metrics and results

**API Endpoints:**
- REST API: `/api/*`
- GraphQL API: `/api/graphql`
- GraphQL Playground: `/api/graphql-playground` (development only)

### Firebase

Client and admin SDK configurations are in `src/lib/firebase/`.

**Available utilities:**
- `client.ts` - Firebase client SDK for browser
- `admin.ts` - Firebase Admin SDK for server
- `auth.ts` - Authentication helpers
- `storage.ts` - File upload/download utilities

## License

MIT
