"""Character sheet routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.database import get_db
from models.user import User
from models.character import Character
from models.sheet import CharacterSheet
from schemas.sheet import CharacterSheetCreate, CharacterSheetUpdate, CharacterSheetResponse
from utils.auth import get_current_user
from utils.sheet_templates import get_sheet_template

router = APIRouter()


@router.get("/templates/{game_type}")
def get_template(game_type: str):
    """Get character sheet template for a game type."""
    template = get_sheet_template(game_type)
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Template for game type '{game_type}' not found"
        )
    return template


@router.get("/templates")
def list_templates():
    """List all available sheet templates."""
    return {
        "templates": [
            "dnd5e",
            "pathfinder",
            "vampire",
            "wod",
            "shadowrun",
            "custom"
        ]
    }


@router.post("/", response_model=CharacterSheetResponse)
def create_sheet(sheet_data: CharacterSheetCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Create a new character sheet."""
    # Verify character exists and belongs to user
    character = db.query(Character).filter(Character.id == sheet_data.character_id, Character.user_id == current_user.id).first()
    if not character:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Character not found"
        )

    new_sheet = CharacterSheet(
        character_id=sheet_data.character_id,
        name=sheet_data.name,
        sheet_type=sheet_data.sheet_type,
        data=sheet_data.data
    )
    db.add(new_sheet)
    db.commit()
    db.refresh(new_sheet)
    return new_sheet


@router.get("/{sheet_id}", response_model=CharacterSheetResponse)
def get_sheet(sheet_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get a specific character sheet."""
    sheet = db.query(CharacterSheet).join(Character).filter(
        CharacterSheet.id == sheet_id,
        Character.user_id == current_user.id
    ).first()
    if not sheet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sheet not found"
        )
    return sheet


@router.put("/{sheet_id}", response_model=CharacterSheetResponse)
def update_sheet(sheet_id: int, sheet_data: CharacterSheetUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Update a character sheet."""
    sheet = db.query(CharacterSheet).join(Character).filter(
        CharacterSheet.id == sheet_id,
        Character.user_id == current_user.id
    ).first()
    if not sheet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sheet not found"
        )

    if sheet_data.name:
        sheet.name = sheet_data.name
    if sheet_data.data:
        sheet.data = sheet_data.data

    db.commit()
    db.refresh(sheet)
    return sheet


@router.delete("/{sheet_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_sheet(sheet_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Delete a character sheet."""
    sheet = db.query(CharacterSheet).join(Character).filter(
        CharacterSheet.id == sheet_id,
        Character.user_id == current_user.id
    ).first()
    if not sheet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sheet not found"
        )
    db.delete(sheet)
    db.commit()
