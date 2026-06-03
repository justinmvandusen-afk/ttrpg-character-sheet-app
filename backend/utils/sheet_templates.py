"""Character sheet templates for different game systems."""
from typing import Dict, Any, Optional


def get_sheet_template(game_type: str) -> Optional[Dict[str, Any]]:
    """Get character sheet template for a game type."""
    templates = {
        "dnd5e": {
            "name": "D&D 5e Character Sheet",
            "abilities": {
                "strength": {"base": 10, "modifier": 0},
                "dexterity": {"base": 10, "modifier": 0},
                "constitution": {"base": 10, "modifier": 0},
                "intelligence": {"base": 10, "modifier": 0},
                "wisdom": {"base": 10, "modifier": 0},
                "charisma": {"base": 10, "modifier": 0},
            },
            "skills": {
                "acrobatics": {"ability": "dexterity", "proficiency": False},
                "animal_handling": {"ability": "wisdom", "proficiency": False},
                "arcana": {"ability": "intelligence", "proficiency": False},
                "athletics": {"ability": "strength", "proficiency": False},
                "deception": {"ability": "charisma", "proficiency": False},
                "history": {"ability": "intelligence", "proficiency": False},
                "insight": {"ability": "wisdom", "proficiency": False},
                "intimidation": {"ability": "charisma", "proficiency": False},
                "investigation": {"ability": "intelligence", "proficiency": False},
                "medicine": {"ability": "wisdom", "proficiency": False},
                "nature": {"ability": "intelligence", "proficiency": False},
                "perception": {"ability": "wisdom", "proficiency": False},
                "performance": {"ability": "charisma", "proficiency": False},
                "persuasion": {"ability": "charisma", "proficiency": False},
                "religion": {"ability": "intelligence", "proficiency": False},
                "sleight_of_hand": {"ability": "dexterity", "proficiency": False},
                "stealth": {"ability": "dexterity", "proficiency": False},
                "survival": {"ability": "wisdom", "proficiency": False},
            },
            "combat": {
                "armor_class": 10,
                "hit_points": 10,
                "hit_dice": "1d8",
                "speed": 30,
                "initiative": 0,
            },
            "features": {
                "class": "",
                "race": "",
                "background": "",
                "alignment": "",
            },
        },
        "pathfinder": {
            "name": "Pathfinder Character Sheet",
            "abilities": {
                "strength": {"base": 10, "modifier": 0},
                "dexterity": {"base": 10, "modifier": 0},
                "constitution": {"base": 10, "modifier": 0},
                "intelligence": {"base": 10, "modifier": 0},
                "wisdom": {"base": 10, "modifier": 0},
                "charisma": {"base": 10, "modifier": 0},
            },
            "combat": {
                "armor_class": 10,
                "hit_points": 10,
                "base_attack_bonus": 0,
                "spell_resistance": 0,
            },
            "features": {
                "class": "",
                "race": "",
                "background": "",
                "deity": "",
            },
        },
        "vampire": {
            "name": "Vampire: The Masquerade Character Sheet",
            "attributes": {
                "physical": {
                    "strength": 1,
                    "dexterity": 1,
                    "stamina": 1,
                },
                "social": {
                    "charisma": 1,
                    "manipulation": 1,
                    "appearance": 1,
                },
                "mental": {
                    "perception": 1,
                    "intelligence": 1,
                    "wits": 1,
                },
            },
            "disciplines": [],
            "blood_pool": 10,
            "willpower": 5,
            "humanity": 7,
        },
        "wod": {
            "name": "World of Darkness Character Sheet",
            "attributes": {
                "physical": {"strength": 1, "dexterity": 1, "stamina": 1},
                "social": {"charisma": 1, "manipulation": 1, "appearance": 1},
                "mental": {"perception": 1, "intelligence": 1, "wits": 1},
            },
            "skills": {},
            "merits": [],
            "flaws": [],
        },
        "custom": {
            "name": "Custom Character Sheet",
            "custom_fields": [],
        },
    }
    return templates.get(game_type)
