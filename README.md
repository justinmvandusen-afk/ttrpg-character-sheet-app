# TTRPG Character Sheet App

A cross-platform tabletop RPG character sheet management application supporting Windows, macOS, iOS, and Android.

## Project Structure

```
ttrpg-character-sheet-app/
├── frontend/                 # React Native + Electron frontend
│   ├── mobile/              # React Native mobile app (iOS/Android)
│   ├── desktop/             # Electron desktop app (Windows/macOS)
│   └── shared/              # Shared components and utilities
├── backend/                 # Python FastAPI backend
│   ├── app/
│   ├── models/
│   ├── routes/
│   ├── schemas/
│   └── config/
├── docs/                    # Documentation
└── scripts/                 # Setup and utility scripts
```

## Features

- ✅ Cross-platform support (iOS, Android, Windows, macOS)
- ✅ Character sheet management for multiple RPG systems (D&D 5e, Pathfinder, Vampire, etc.)
- ✅ Multi-game server structure with game templates
- ✅ Real-time data synchronization
- ✅ Offline support with local SQLite database
- ✅ User authentication and authorization
- ✅ Cloud backup and restore
- ✅ Import/Export character sheets

## Tech Stack

### Frontend
- **React Native** - iOS/Android (Expo)
- **Electron** - Windows/macOS desktop
- **Redux Toolkit** - State management
- **SQLite** - Local storage
- **TypeScript** - Type safety

### Backend
- **Python 3.9+**
- **FastAPI** - High-performance API framework
- **SQLAlchemy** - ORM
- **SQLite** - Database
- **Pydantic** - Data validation
- **JWT** - Authentication
- **Alembic** - Database migrations

## System Requirements

### Backend
- Python 3.9+
- pip/venv

### Frontend (Mobile)
- Node.js 16+
- npm or yarn
- Expo CLI
- iOS: macOS with Xcode
- Android: Android Studio or SDK

### Frontend (Desktop)
- Node.js 16+
- npm or yarn

## Quick Start

### 1. Backend Setup

```bash
cd backend
python -m venv venv

# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate

pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs on: `http://localhost:8000`
API docs: `http://localhost:8000/docs`

### 2. Mobile Setup (React Native)

```bash
cd frontend/mobile
npm install
npx expo start

# Press 'i' for iOS simulator or 'a' for Android emulator
```

### 3. Desktop Setup (Electron)

```bash
cd frontend/desktop
npm install
npm start
```

## Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
DATABASE_URL=sqlite:///./ttrpg.db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
DEBUG=True
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout

### Games
- `GET /api/games` - List all games
- `POST /api/games` - Create new game
- `GET /api/games/{game_id}` - Get game details
- `PUT /api/games/{game_id}` - Update game
- `DELETE /api/games/{game_id}` - Delete game

### Characters
- `GET /api/games/{game_id}/characters` - List characters in game
- `POST /api/games/{game_id}/characters` - Create character
- `GET /api/characters/{character_id}` - Get character details
- `PUT /api/characters/{character_id}` - Update character
- `DELETE /api/characters/{character_id}` - Delete character

### Character Sheets
- `GET /api/sheets/templates/{game_type}` - Get sheet template
- `POST /api/characters/{character_id}/sheets` - Create sheet
- `GET /api/characters/{character_id}/sheets` - Get character sheets
- `PUT /api/sheets/{sheet_id}` - Update sheet

## Database Schema

The app uses SQLite with the following main tables:

- **users** - User accounts and authentication
- **games** - Game campaigns/sessions
- **characters** - Character records
- **character_sheets** - Character sheet data
- **sheet_attributes** - Dynamic attributes per game type

## Project Structure Details

### Backend Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app initialization
│   └── database.py          # Database connection and session
├── models/
│   ├── __init__.py
│   ├── user.py              # User model
│   ├── game.py              # Game/Campaign model
│   ├── character.py         # Character model
│   └── sheet.py             # Character sheet model
├── routes/
│   ├── __init__.py
│   ├── auth.py              # Authentication endpoints
│   ├── games.py             # Game management endpoints
│   ├── characters.py        # Character CRUD endpoints
│   └── sheets.py            # Character sheet endpoints
├── schemas/
│   ├── __init__.py
│   ├── user.py              # Pydantic user schemas
│   ├── game.py              # Pydantic game schemas
│   ├── character.py         # Pydantic character schemas
│   └── sheet.py             # Pydantic sheet schemas
├── config/
│   ├── __init__.py
│   └── settings.py          # Configuration and settings
├── utils/
│   ├── __init__.py
│   ├── auth.py              # JWT token utilities
│   └── validators.py        # Custom validators
├── requirements.txt         # Python dependencies
└── main.py                  # Entry point
```

### Frontend Structure

```
frontend/
├── mobile/                  # React Native Expo app
│   ├── app.json             # Expo configuration
│   ├── package.json         # Dependencies
│   ├── src/
│   │   ├── screens/         # Screen components
│   │   ├── components/      # Reusable components
│   │   ├── store/           # Redux store
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utilities
│   │   └── App.tsx          # Root component
│   └── assets/              # Images, fonts
├── desktop/                 # Electron app
│   ├── public/
│   │   └── electron.js      # Main process
│   ├── src/
│   │   ├── screens/         # Screen components
│   │   ├── components/      # Reusable components
│   │   ├── store/           # Redux store
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   ├── App.tsx          # Root component
│   │   └── index.tsx        # React entry point
│   └── package.json         # Dependencies
└── shared/                  # Shared code
    ├── src/
    │   ├── types/           # Shared TypeScript types
    │   ├── services/        # Shared services
    │   ├── utils/           # Shared utilities
    │   └── constants/       # Shared constants
    └── package.json         # Shared dependencies
```

## Development Workflow

1. **Backend Development**: Run FastAPI in development mode with auto-reload
2. **Frontend Development**: Use Expo and Electron dev servers
3. **Database**: SQLite file stored locally and synced via API
4. **State Management**: Redux for app state, local storage for offline data

## Testing

### Backend
```bash
cd backend
pytest
```

### Frontend
```bash
cd frontend/mobile
npm test

cd frontend/desktop
npm test
```

## Deployment

### Backend
- Deploy to Heroku, Railway, or DigitalOcean
- Use PostgreSQL for production (upgrade from SQLite)
- Set up proper environment variables

### Frontend
- iOS: Build and deploy via TestFlight/App Store
- Android: Build and deploy via Google Play Store
- Desktop: Build installers for Windows/macOS

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT

## Support

For issues and questions, please create a GitHub issue.
