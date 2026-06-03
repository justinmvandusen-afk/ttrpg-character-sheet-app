"""Game management routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from models.user import User
from models.game import Game
from schemas.game import GameCreate, GameUpdate, GameResponse
from utils.auth import get_current_user

router = APIRouter()


@router.get("/", response_model=List[GameResponse])
def list_games(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """List all games for the current user."""
    games = db.query(Game).filter(Game.owner_id == current_user.id).all()
    return games


@router.post("/", response_model=GameResponse)
def create_game(game_data: GameCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Create a new game."""
    new_game = Game(
        name=game_data.name,
        description=game_data.description,
        game_type=game_data.game_type,
        owner_id=current_user.id
    )
    db.add(new_game)
    db.commit()
    db.refresh(new_game)
    return new_game


@router.get("/{game_id}", response_model=GameResponse)
def get_game(game_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get a specific game."""
    game = db.query(Game).filter(Game.id == game_id, Game.owner_id == current_user.id).first()
    if not game:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Game not found"
        )
    return game


@router.put("/{game_id}", response_model=GameResponse)
def update_game(game_id: int, game_data: GameUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Update a game."""
    game = db.query(Game).filter(Game.id == game_id, Game.owner_id == current_user.id).first()
    if not game:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Game not found"
        )

    if game_data.name:
        game.name = game_data.name
    if game_data.description:
        game.description = game_data.description

    db.commit()
    db.refresh(game)
    return game


@router.delete("/{game_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_game(game_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Delete a game."""
    game = db.query(Game).filter(Game.id == game_id, Game.owner_id == current_user.id).first()
    if not game:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Game not found"
        )
    db.delete(game)
    db.commit()
