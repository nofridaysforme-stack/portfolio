# Lib Directory

Utility functions and third-party service integrations.

## Structure

### `/firebase`
Firebase SDK initialization and utilities
- `client.ts` - Client-side Firebase config
- `admin.ts` - Server-side Firebase Admin SDK
- `storage.ts` - Firebase Storage utilities
- `auth.ts` - Authentication helpers

### `/payload`
Payload CMS utilities and helpers
- `getPayload.ts` - Get Payload instance
- `queries.ts` - Reusable Payload queries
- `cache.ts` - Caching utilities

### `/utils`
General utility functions
- `cn.ts` - Tailwind class name merger
- `formatters.ts` - Date, number formatters
- `validators.ts` - Validation utilities
- `seo.ts` - SEO metadata generators

## Usage

Import utilities as needed:
```typescript
import { cn } from '@/lib/utils/cn'
import { getFirebaseStorage } from '@/lib/firebase/storage'
```
