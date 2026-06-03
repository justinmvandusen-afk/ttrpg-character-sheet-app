"""Character management routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from models.user import User
from models.game import Game
from models.character import Character
from schemas.character import CharacterCreate, CharacterUpdate, CharacterResponse
from utils.auth import get_current_user

router = APIRouter()


@router.get("/", response_model=List[CharacterResponse])
def list_characters(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """List all characters for the current user."""
    characters = db.query(Character).filter(Character.user_id == current_user.id).all()
    return characters


@router.post("/", response_model=CharacterResponse)
def create_character(char_data: CharacterCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Create a new character."""
    # Verify game exists and belongs to user
    game = db.query(Game).filter(Game.id == char_data.game_id, Game.owner_id == current_user.id).first()
    if not game:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Game not found"
        )

    new_character = Character(
        name=char_data.name,
        description=char_data.description,
        game_id=char_data.game_id,
        user_id=current_user.id,
        level=char_data.level,
        experience=char_data.experience
    )
    db.add(new_character)
    db.commit()
    db.refresh(new_character)
    return new_character


@router.get("/{character_id}", response_model=CharacterResponse)
def get_character(character_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get a specific character."""
    character = db.query(Character).filter(Character.id == character_id, Character.user_id == current_user.id).first()
    if not character:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Character not found"
        )
    return character


@router.put("/{character_id}", response_model=CharacterResponse)
def update_character(character_id: int, char_data: CharacterUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Update a character."""
    character = db.query(Character).filter(Character.id == character_id, Character.user_id == current_user.id).first()
    if not character:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Character not found"
        )

    if char_data.name:
        character.name = char_data.name
    if char_data.description:
        character.description = char_data.description
    if char_data.level:
        character.level = char_data.level
    if char_data.experience:
        character.experience = char_data.experience

    db.commit()
    db.refresh(character)
    return character


@router.delete("/{character_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_character(character_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Delete a character."""
    character = db.query(Character).filter(Character.id == character_id, Character.user_id == current_user.id).first()
    if not character:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Character not found"
        )
    db.delete(character)
    db.commit()
