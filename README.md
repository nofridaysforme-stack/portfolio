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

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Access the Payload admin panel at [http://localhost:3000/admin](http://localhost:3000/admin)

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
- `npm run payload` - Run Payload CLI commands

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

Configure collections, blocks, and globals in `src/payload/payload.config.ts`.

### Firebase

Client and admin SDK configurations are in `src/lib/firebase/`.

## License

MIT
