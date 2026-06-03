"""Character sheet model."""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class CharacterSheet(Base):
    """Character sheet model."""

    __tablename__ = "character_sheets"

    id = Column(Integer, primary_key=True, index=True)
    character_id = Column(Integer, ForeignKey("characters.id"))
    name = Column(String, default="Main Sheet")
    sheet_type = Column(String)  # e.g., "dnd5e", "pathfinder"
    data = Column(JSON)  # Stores flexible sheet data based on game type
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    character = relationship("Character", back_populates="sheets")
    attributes = relationship("SheetAttribute", back_populates="sheet", cascade="all, delete-orphan")


class SheetAttribute(Base):
    """Sheet attribute model for custom attributes."""

    __tablename__ = "sheet_attributes"

    id = Column(Integer, primary_key=True, index=True)
    sheet_id = Column(Integer, ForeignKey("character_sheets.id"))
    attribute_name = Column(String, index=True)
    attribute_value = Column(Text)
    attribute_type = Column(String)  # e.g., "string", "number", "boolean", "list"
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    sheet = relationship("CharacterSheet", back_populates="attributes")
