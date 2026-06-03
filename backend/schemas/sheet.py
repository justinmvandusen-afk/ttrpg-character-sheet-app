"""Character sheet schemas."""
from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime


class SheetAttributeBase(BaseModel):
    """Base sheet attribute schema."""
    attribute_name: str
    attribute_value: str
    attribute_type: str  # e.g., "string", "number", "boolean"


class SheetAttributeCreate(SheetAttributeBase):
    """Sheet attribute creation schema."""
    pass


class SheetAttributeResponse(SheetAttributeBase):
    """Sheet attribute response schema."""
    id: int
    sheet_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CharacterSheetBase(BaseModel):
    """Base character sheet schema."""
    name: str = "Main Sheet"
    sheet_type: str  # e.g., "dnd5e", "pathfinder"
    data: Dict[str, Any] = {}


class CharacterSheetCreate(CharacterSheetBase):
    """Character sheet creation schema."""
    character_id: int


class CharacterSheetUpdate(BaseModel):
    """Character sheet update schema."""
    name: Optional[str] = None
    data: Optional[Dict[str, Any]] = None


class CharacterSheetResponse(CharacterSheetBase):
    """Character sheet response schema."""
    id: int
    character_id: int
    created_at: datetime
    updated_at: datetime
    attributes: list[SheetAttributeResponse] = []

    class Config:
        from_attributes = True
