"""Character schemas."""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CharacterBase(BaseModel):
    """Base character schema."""
    name: str
    description: Optional[str] = None
    level: int = 1
    experience: int = 0


class CharacterCreate(CharacterBase):
    """Character creation schema."""
    game_id: int


class CharacterUpdate(BaseModel):
    """Character update schema."""
    name: Optional[str] = None
    description: Optional[str] = None
    level: Optional[int] = None
    experience: Optional[int] = None


class CharacterResponse(CharacterBase):
    """Character response schema."""
    id: int
    game_id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
