# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Applications                        │
├─────────────────┬─────────────────┬──────────────────────────┤
│  iOS App        │  Android App    │  Windows/Mac Desktop     │
│ (React Native)  │ (React Native)  │     (Electron)           │
└────────┬────────┴────────┬────────┴────────────┬─────────────┘
         │                │                     │
         └────────────────┼─────────────────────┘
                          │ HTTP/REST
                          ▼
         ┌────────────────────────────────┐
         │     FastAPI Backend Server     │
         │   (Python 3.9+)                │
         ├────────────────────────────────┤
         │  Routes:                       │
         │  • Auth                        │
         │  • Games                       │
         │  • Characters                  │
         │  • Character Sheets            │
         └────────────────┬───────────────┘
                          │
                          ▼
         ┌────────────────────────────────┐
         │    SQLite Database             │
         │   (Local File-based)           │
         ├────────────────────────────────┤
         │  Tables:                       │
         │  • users                       │
         │  • games                       │
         │  • characters                  │
         │  • character_sheets            │
         │  • sheet_attributes            │
         └────────────────────────────────┘
```

## Component Breakdown

### Frontend Architecture

#### Mobile (React Native + Expo)
```
frontend/mobile/
├── src/
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── GamesListScreen.tsx
│   │   ├── CharacterListScreen.tsx
│   │   └── CharacterSheetScreen.tsx
│   │
│   ├── components/
│   │   ├── CharacterForm.tsx
│   │   ├── SheetEditor.tsx
│   │   └── GameSelector.tsx
│   │
│   ├── store/
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── gamesSlice.ts
│   │   │   ├── characterSlice.ts
│   │   │   └── sheetSlice.ts
│   │   └── store.ts
│   │
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── games.ts
│   │   ├── characters.ts
│   │   └── sheets.ts
│   │
│   ├── utils/
│   │   ├── validation.ts
│   │   ├── formatting.ts
│   │   └── storage.ts
│   │
│   ├── types/
│   │   ├── index.ts
│   │   └── api.ts
│   │
│   └── App.tsx
```

#### Desktop (Electron)
```
frontend/desktop/
├── public/
│   └── electron.js          # Main process
├── src/
│   ├── screens/
│   ├── components/
│   ├── store/
│   ├── services/
│   ├── utils/
│   ├── types/
│   └── App.tsx
```

### Backend Architecture

#### Layer Structure
```
backend/
├── app/
│   ├── main.py              # FastAPI app initialization
│   └── database.py          # Database connection
│
├── models/
│   ├── user.py              # SQLAlchemy models
│   ├── game.py
│   ├── character.py
│   └── sheet.py
│
├── routes/
│   ├── auth.py              # Route handlers
│   ├── games.py
│   ├── characters.py
│   └── sheets.py
│
├── schemas/
│   ├── user.py              # Pydantic validation schemas
│   ├── game.py
│   ├── character.py
│   └── sheet.py
│
├── utils/
│   ├── auth.py              # JWT, password utilities
│   └── sheet_templates.py   # Game-specific templates
│
├── config/
│   └── settings.py          # Configuration
│
└── main.py                  # Entry point
```

## Data Flow

### Authentication Flow
```
1. User enters credentials
   ↓
2. Frontend sends POST /auth/login
   ↓
3. Backend validates credentials against users table
   ↓
4. Backend generates JWT tokens (access + refresh)
   ↓
5. Frontend stores tokens locally
   ↓
6. Frontend includes access token in Authorization header for subsequent requests
```

### Character Sheet Management Flow
```
1. User creates game
   ↓
2. GET /sheets/templates/{game_type} to fetch template
   ↓
3. User creates character in that game
   ↓
4. POST /sheets with character_id and template data
   ↓
5. Backend creates CharacterSheet + SheetAttribute records
   ↓
6. Frontend stores sheet data locally via SQLite
   ↓
7. User updates sheet
   ↓
8. Frontend syncs changes via PUT /sheets/{sheet_id}
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username VARCHAR UNIQUE,
    email VARCHAR UNIQUE,
    hashed_password VARCHAR,
    full_name VARCHAR,
    is_active BOOLEAN,
    created_at DATETIME,
    updated_at DATETIME
);
```

### Games Table
```sql
CREATE TABLE games (
    id INTEGER PRIMARY KEY,
    name VARCHAR,
    description TEXT,
    game_type VARCHAR,
    owner_id INTEGER FOREIGN KEY,
    created_at DATETIME,
    updated_at DATETIME
);
```

### Characters Table
```sql
CREATE TABLE characters (
    id INTEGER PRIMARY KEY,
    name VARCHAR,
    description TEXT,
    game_id INTEGER FOREIGN KEY,
    user_id INTEGER FOREIGN KEY,
    level INTEGER,
    experience INTEGER,
    created_at DATETIME,
    updated_at DATETIME
);
```

### Character Sheets Table
```sql
CREATE TABLE character_sheets (
    id INTEGER PRIMARY KEY,
    character_id INTEGER FOREIGN KEY,
    name VARCHAR,
    sheet_type VARCHAR,
    data JSON,
    created_at DATETIME,
    updated_at DATETIME
);
```

### Sheet Attributes Table
```sql
CREATE TABLE sheet_attributes (
    id INTEGER PRIMARY KEY,
    sheet_id INTEGER FOREIGN KEY,
    attribute_name VARCHAR,
    attribute_value TEXT,
    attribute_type VARCHAR,
    created_at DATETIME,
    updated_at DATETIME
);
```

## Security Considerations

### Authentication
- JWT tokens with configurable expiration
- Separate access and refresh tokens
- Bcrypt password hashing
- Token validation on protected endpoints

### Data Protection
- User isolation (users can only access their own data)
- CORS configuration for trusted origins
- SQL injection prevention via SQLAlchemy ORM
- Pydantic input validation

### Best Practices
- Environment variables for sensitive config
- HTTPS in production
- Secure token storage on frontend
- Regular dependency updates

## Offline Support

### Local Storage Strategy
1. **SQLite on Mobile/Desktop**: Store character sheets locally
2. **Redux Store**: Cache API responses
3. **Sync Queue**: Queue changes when offline
4. **Auto-Sync**: Sync when connection restored

### Sync Protocol
```
Online State:
  - Direct API calls
  - Immediate response
  - Auto-save to local storage

Offline State:
  - Queue operations locally
  - Work with cached data
  - Show "offline" indicator

Re-connection:
  - Detect connection restored
  - Process sync queue
  - Resolve conflicts (server wins)
  - Update local state
```

## Scalability Notes

### Current Design (SQLite)
- Single file database
- Best for: Development, small deployments, offline-first apps
- Limitations: Concurrent writes, large datasets

### Future Upgrades
- **PostgreSQL**: For production deployments
- **Cloud Sync**: Firebase or AWS Amplify
- **Real-time Updates**: WebSockets for live sync
- **Caching**: Redis for session/data caching
