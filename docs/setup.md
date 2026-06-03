# Setup Guide

## Backend Setup (Python/FastAPI)

### Prerequisites
- Python 3.9+
- pip
- Virtual environment tool (venv)

### Installation Steps

1. **Create virtual environment**
   ```bash
   cd backend
   python -m venv venv
   ```

2. **Activate virtual environment**
   ```bash
   # On macOS/Linux
   source venv/bin/activate

   # On Windows
   venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and change SECRET_KEY
   ```

5. **Initialize database**
   The database will be created automatically on first run. SQLite file will be created at `./ttrpg.db`

6. **Run the server**
   ```bash
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   Server will be available at: `http://localhost:8000`
   API documentation: `http://localhost:8000/docs`

## Frontend Setup (React Native + Electron)

### Prerequisites
- Node.js 16+
- npm or yarn
- For iOS: macOS with Xcode
- For Android: Android Studio or Android SDK

### Mobile Setup (React Native/Expo)

1. **Install Expo CLI globally**
   ```bash
   npm install -g expo-cli
   ```

2. **Install dependencies**
   ```bash
   cd frontend/mobile
   npm install
   ```

3. **Start development server**
   ```bash
   npx expo start
   ```

4. **Run on simulators/emulators**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web

### Desktop Setup (Electron)

1. **Install dependencies**
   ```bash
   cd frontend/desktop
   npm install
   ```

2. **Start development server**
   ```bash
   npm start
   ```

3. **Build for production**
   ```bash
   npm run build
   npm run package
   ```

## Environment Configuration

### Backend Environment Variables

Create `.env` file in the backend directory:

```env
# Database URL (SQLite)
DATABASE_URL=sqlite:///./ttrpg.db

# JWT Configuration
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Server Settings
DEBUG=True
HOST=0.0.0.0
PORT=8000

# CORS Origins (allowed domains)
CORS_ORIGINS=["http://localhost:3000","http://localhost:19000","http://localhost:8081"]
```

### Frontend Configuration

#### Mobile (app.json)
Update `frontend/mobile/app.json` with your API server URL:

```json
{
  "expo": {
    "extra": {
      "apiUrl": "http://localhost:8000"
    }
  }
}
```

#### Desktop (config)
Create `frontend/desktop/src/config.ts`:

```typescript
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
```

## Database Setup

The SQLite database is automatically created on first run. It will be stored at `backend/ttrpg.db`.

### Database Schema

The following tables are created:

1. **users** - User accounts
2. **games** - Game campaigns
3. **characters** - Character records
4. **character_sheets** - Character sheet data
5. **sheet_attributes** - Custom attributes per sheet

### Resetting Database

To reset the database:

```bash
rm backend/ttrpg.db
```

The database will be recreated on next server start.

## Troubleshooting

### Backend Issues

**Port already in use**
```bash
# Use a different port
python -m uvicorn app.main:app --reload --port 8001
```

**Database locked**
```bash
# Remove and recreate
rm backend/ttrpg.db
```

### Frontend Issues

**Expo connection issues**
- Clear cache: `expo start --clear`
- Check if backend is running on correct port

**Electron build issues**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version`

## Development Tips

1. **Hot Reload**: Both backend and frontend support hot reload
2. **API Testing**: Use Swagger UI at `http://localhost:8000/docs`
3. **Database Inspection**: Use SQLite browser to inspect `ttrpg.db`
4. **Logs**: Check terminal output for debugging information
