# KilometriTracker - Frontend

React + TypeScript + Mantine UI frontend for business trip tracking application.

## Tech Stack

- React 18
- TypeScript
- Vite (build tool)
- Mantine UI (component library)
- React Router (navigation)
- Axios (API client)
- @tabler/icons-react (icons)

## Features

- User authentication (login/register with JWT)
- Dark mode toggle
- Trip management (add, list, delete trips)
- Monthly reports with PDF generation
- Responsive design
- Finnish language UI

## Project Structure
```
src/
├── api/              # API client and endpoint functions
│   ├── client.ts     # Axios instance with JWT interceptors
│   ├── auth.ts       # Authentication endpoints
│   ├── trips.ts      # Trip endpoints
│   └── reports.ts    # Report endpoints
├── components/       # Reusable components
│   └── Layout.tsx    # Main layout with navbar
├── pages/            # Page components
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── TripsPage.tsx
│   ├── ReportsPage.tsx (TODO)
│   ├── DashboardPage.tsx (TODO)
│   └── ProfilePage.tsx (TODO)
├── types/            # TypeScript type definitions
│   └── index.ts      # API response types
├── utils/            # Utility functions
│   └── ColorSchemeProvider.tsx  # Dark mode context
├── App.tsx           # Main app with routes
├── main.tsx          # Entry point
└── theme.ts          # Mantine theme configuration
```

## Installation

### Prerequisites

- Node.js 18+ and npm
- Backend running at http://127.0.0.1:8000

### Setup
```bash
# Clone repository
cd /home/crake178/projects/
git clone <repository-url>
cd kilometri-tracker-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at: http://localhost:5173

## Environment Configuration

Backend API URL is hardcoded in `src/api/client.ts`:
```typescript
const API_BASE_URL = 'http://127.0.0.1:8000/api';
```

Change this if your backend runs on a different port.

## API Integration

### Authentication Flow

1. User logs in via `/api/auth/login/`
2. Backend returns JWT tokens (access + refresh)
3. Tokens stored in localStorage
4. Axios interceptor adds `Authorization: Bearer <token>` to all requests
5. Automatic token refresh when access token expires

### Available API Functions

**Authentication:**
- `login(credentials)` - Login with username/password
- `register(data)` - Create new user account
- `logout()` - Logout and blacklist refresh token
- `getProfile()` - Get current user profile
- `updateProfile(data)` - Update user profile
- `changePassword(oldPassword, newPassword)` - Change password

**Trips:**
- `getTrips(params)` - List trips with filtering/pagination
- `getTrip(id)` - Get single trip
- `createTrip(data)` - Create new trip
- `updateTrip(id, data)` - Update trip (PUT)
- `patchTrip(id, data)` - Partial update (PATCH)
- `deleteTrip(id)` - Delete trip
- `getMonthlySummary(year, month)` - Get monthly statistics
- `calculateDistance(start, end)` - Calculate distance via Google Maps (placeholder)

**Reports:**
- `getReports(params)` - List generated reports
- `getReport(id)` - Get single report
- `generateReport(year, month)` - Generate monthly PDF report
- `downloadPDF(url)` - Open PDF in new tab
- `forceDownloadPDF(url, filename)` - Force download PDF

## Development Notes

### Code Style

- All code comments in English (CodeNob Dev standard)
- Finnish language for UI text
- TypeScript strict mode enabled
- ESLint + Prettier for code formatting

### Component Patterns

**Protected Routes:**
Routes that require authentication automatically redirect to `/login` if user is not authenticated.

**Public Routes:**
Login/Register pages redirect to `/dashboard` if user is already authenticated.

**Dark Mode:**
Managed via ColorSchemeProvider context. Preference saved to localStorage.

### Known Issues

- Date picker locale is English (Mantine defaults)
- Some backend error messages in English (will be translated in frontend)

## Building for Production
```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

Production files will be in `dist/` directory.

## TODO

- [ ] Reports page (PDF generation)
- [ ] Dashboard page (statistics overview)
- [ ] Profile page (edit user info)
- [ ] Trip edit functionality
- [ ] Google Maps distance calculation integration
- [ ] Better error handling and validation
- [ ] Loading states for all API calls
- [ ] Unit tests with Vitest
- [ ] E2E tests with Playwright
- [ ] Docker containerization
- [ ] CI/CD pipeline

## Backend Requirements

Backend must be running with CORS enabled for:
- http://localhost:5173
- http://127.0.0.1:5173

Backend `.env` file:
```
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173
```

## License

Private project - Sami T