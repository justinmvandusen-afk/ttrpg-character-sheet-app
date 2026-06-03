# API Documentation

## Base URL
`http://localhost:8000/api`

## Authentication

All authenticated endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

## Auth Endpoints

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "username": "player1",
  "email": "player@example.com",
  "password": "securepassword",
  "full_name": "John Doe"
}

Response: 200 OK
{
  "id": 1,
  "username": "player1",
  "email": "player@example.com",
  "full_name": "John Doe",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "player1",
  "password": "securepassword"
}

Response: 200 OK
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": { ... }
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <access_token>

Response: 200 OK
{
  "id": 1,
  "username": "player1",
  "email": "player@example.com",
  "full_name": "John Doe",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00"
}
```

## Game Endpoints

### List Games
```http
GET /games
Authorization: Bearer <access_token>

Response: 200 OK
[
  {
    "id": 1,
    "name": "Lost Mines of Phandelver",
    "description": "A classic D&D 5e adventure",
    "game_type": "dnd5e",
    "owner_id": 1,
    "created_at": "2024-01-01T00:00:00",
    "updated_at": "2024-01-01T00:00:00"
  }
]
```

### Create Game
```http
POST /games
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Lost Mines of Phandelver",
  "description": "A classic D&D 5e adventure",
  "game_type": "dnd5e"
}

Response: 201 Created
{
  "id": 1,
  "name": "Lost Mines of Phandelver",
  "description": "A classic D&D 5e adventure",
  "game_type": "dnd5e",
  "owner_id": 1,
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00"
}
```

### Get Game
```http
GET /games/{game_id}
Authorization: Bearer <access_token>

Response: 200 OK
{ ... }
```

### Update Game
```http
PUT /games/{game_id}
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Updated Game Name",
  "description": "Updated description"
}

Response: 200 OK
{ ... }
```

### Delete Game
```http
DELETE /games/{game_id}
Authorization: Bearer <access_token>

Response: 204 No Content
```

## Character Endpoints

### List Characters
```http
GET /characters
Authorization: Bearer <access_token>

Response: 200 OK
[
  {
    "id": 1,
    "name": "Aragorn",
    "description": "A ranger and future king",
    "game_id": 1,
    "user_id": 1,
    "level": 5,
    "experience": 6500,
    "created_at": "2024-01-01T00:00:00",
    "updated_at": "2024-01-01T00:00:00"
  }
]
```

### Create Character
```http
POST /characters
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Aragorn",
  "description": "A ranger and future king",
  "game_id": 1,
  "level": 5,
  "experience": 6500
}

Response: 201 Created
{ ... }
```

### Get Character
```http
GET /characters/{character_id}
Authorization: Bearer <access_token>

Response: 200 OK
{ ... }
```

### Update Character
```http
PUT /characters/{character_id}
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Aragorn Elessar",
  "level": 6
}

Response: 200 OK
{ ... }
```

### Delete Character
```http
DELETE /characters/{character_id}
Authorization: Bearer <access_token>

Response: 204 No Content
```

## Character Sheet Endpoints

### Get Sheet Templates
```http
GET /sheets/templates

Response: 200 OK
{
  "templates": ["dnd5e", "pathfinder", "vampire", "wod", "shadowrun", "custom"]
}
```

### Get Specific Template
```http
GET /sheets/templates/{game_type}

Response: 200 OK
{
  "name": "D&D 5e Character Sheet",
  "abilities": { ... },
  "skills": { ... },
  "combat": { ... }
}
```

### Create Character Sheet
```http
POST /sheets
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "character_id": 1,
  "name": "Main Sheet",
  "sheet_type": "dnd5e",
  "data": {
    "abilities": {
      "strength": {"base": 15, "modifier": 2}
    }
  }
}

Response: 201 Created
{ ... }
```

### Get Character Sheet
```http
GET /sheets/{sheet_id}
Authorization: Bearer <access_token>

Response: 200 OK
{ ... }
```

### Update Character Sheet
```http
PUT /sheets/{sheet_id}
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Updated Sheet",
  "data": { ... }
}

Response: 200 OK
{ ... }
```

### Delete Character Sheet
```http
DELETE /sheets/{sheet_id}
Authorization: Bearer <access_token>

Response: 204 No Content
```

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Invalid request data"
}
```

### 401 Unauthorized
```json
{
  "detail": "Could not validate credentials"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 500 Server Error
```json
{
  "detail": "Internal server error"
}
```
