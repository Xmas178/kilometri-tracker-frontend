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
- Trip management (add, edit, delete trips)
- Monthly reports with PDF generation
- Profile management (edit user info, change password)
- Dashboard with statistics
- Responsive design
- Finnish language UI
- Backend error translations (English to Finnish)

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
│   ├── DashboardPage.tsx
│   ├── TripsPage.tsx
│   ├── ReportsPage.tsx
│   └── ProfilePage.tsx
├── types/            # TypeScript type definitions
│   └── index.ts      # API response types
├── utils/            # Utility functions
│   ├── ColorSchemeProvider.tsx  # Dark mode context
│   └── translateError.ts        # Backend error translation
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
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at: http://localhost:5173

## Environment Configuration

Backend API URL is configured in `src/api/client.ts`:
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
- `deleteTrip(id)` - Delete trip
- `getMonthlySummary(year, month)` - Get monthly statistics

**Reports:**
- `getReports(params)` - List generated reports
- `generateReport(year, month)` - Generate monthly PDF report
- `downloadPDF(url)` - Open PDF in new tab

## Development

### Code Style

- All code comments in English (CodeNob Dev standard)
- Finnish language for UI text
- TypeScript strict mode enabled
- ESLint for code quality

### Component Patterns

**Protected Routes:**
Routes that require authentication automatically redirect to `/login` if user is not authenticated.

**Public Routes:**
Login/Register pages redirect to `/dashboard` if user is already authenticated.

**Dark Mode:**
Managed via ColorSchemeProvider context. Preference saved to localStorage.

## Docker

### Build Docker Image
```bash
docker build -t kilometri-frontend .
```

### Run Container
```bash
docker run -p 80:80 kilometri-frontend
```

### Docker Compose
```bash
# From project root with docker-compose.yml
docker-compose up

# Frontend available at: http://localhost/
```

## CI/CD

GitHub Actions workflow runs automatically on push to main:

1. Checkout code
2. Setup Node.js 18
3. Install dependencies (npm ci)
4. Run ESLint (allows warnings)
5. Build project (npm run build)
6. Verify build output (dist/ directory)
7. Build Docker image
8. Verify Docker image

Pipeline status: https://github.com/Xmas178/kilometri-tracker-frontend/actions

## Building for Production
```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

Production files will be in `dist/` directory.

## Completed Features

**Authentication & User Management:**
- Login/Register pages with validation
- JWT authentication with auto-refresh
- Profile page (edit user info, change password)
- Secure logout with token blacklisting

**Trip Management:**
- Dashboard page with statistics (total km, trip counts, monthly summary)
- Trips page (add, edit, delete trips)
- Date picker with Finnish formatting
- Input validation with translated error messages
- Real-time data updates

**Reports & Analytics:**
- Reports page with PDF generation
- Monthly trip summaries
- PDF download directly in browser
- Trip statistics visualization

**UI/UX:**
- Dark mode toggle (persistent via localStorage)
- Mantine UI component library
- Responsive design
- Finnish language UI
- 8-second notification duration
- Loading states for all async operations

**Developer Experience:**
- TypeScript strict mode
- ESLint configured
- Backend error translation system (English to Finnish)
- Comprehensive English code comments
- Clean component architecture

**DevOps:**
- Docker containerization with nginx
- GitHub Actions CI/CD pipeline
- Automated build and test on push
- Security audit passed (0 vulnerabilities)
- Production-ready nginx configuration

## TODO (Future Enhancements)

- Google Maps distance calculation integration
- Excel report generation
- Email delivery for reports
- Trip filtering by date range
- Chart visualizations (Dashboard)
- Trip search functionality
- Bulk trip import (CSV/Excel)
- Multi-language support
- Unit tests with Vitest
- E2E tests with Playwright
- Progressive Web App (PWA)
- Offline mode support
- Production deployment automation

## Backend Requirements

Backend must be running with CORS enabled for:
- http://localhost:5173
- http://127.0.0.1:5173
- http://localhost (Docker)

Backend `.env` file:
```
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173,http://localhost
```

## Known Issues

- Date picker locale is English (Mantine defaults)
- Some TypeScript `any` types in error handling (non-critical)

## License

Private project - CodeNob Dev

## Author

Sami - CodeNob Dev
- GitHub: https://github.com/Xmas178
- Portfolio: www.tommilammi.fi