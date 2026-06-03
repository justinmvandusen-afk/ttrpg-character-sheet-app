"""Game schemas."""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class GameBase(BaseModel):
    """Base game schema."""
    name: str
    description: Optional[str] = None
    game_type: str  # e.g., "dnd5e", "pathfinder"


class GameCreate(GameBase):
    """Game creation schema."""
    pass


class GameUpdate(BaseModel):
    """Game update schema."""
    name: Optional[str] = None
    description: Optional[str] = None


class GameResponse(GameBase):
    """Game response schema."""
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
