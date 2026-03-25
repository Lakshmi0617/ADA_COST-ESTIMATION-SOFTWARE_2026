import datetime

from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy.orm import Session

import models

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def init_default_rates(db: Session):
    if db.query(models.MachineRates).count() == 0:  # only insert if empty
        default_rates = [
            {"machine_type": "5 Axis", "volume_limit": 75000000, "hourly_rate": 3500, "size": "500*500*300"},
            {"machine_type": "5 Axis", "volume_limit": 400000000, "hourly_rate": 4500, "size": "1000*800*500"},
            {"machine_type": "5 Axis", "volume_limit": 1000000000, "hourly_rate": 5000, "size": "2000*1000*500"},
            {"machine_type": "5 Axis", "volume_limit": 9999999999, "hourly_rate": 6000, "size": "3000*1500*800"},

            {"machine_type": "4 Axis", "volume_limit": 75000000, "hourly_rate": 3000, "size": "500*500*300"},
            {"machine_type": "4 Axis", "volume_limit": 400000000, "hourly_rate": 3500, "size": "1000*800*500"},
            {"machine_type": "4 Axis", "volume_limit": 1000000000, "hourly_rate": 4000, "size": "2000*1000*500"},
            {"machine_type": "4 Axis", "volume_limit": 9999999999, "hourly_rate": 5000, "size": "3000*1500*800"},

            {"machine_type": "3 Axis", "volume_limit": 75000000, "hourly_rate": 2000, "size": "500*500*300"},
            {"machine_type": "3 Axis", "volume_limit": 400000000, "hourly_rate": 2500, "size": "1000*800*500"},
            {"machine_type": "3 Axis", "volume_limit": 1000000000, "hourly_rate": 3000, "size": "2000*1000*500"},
            {"machine_type": "3 Axis", "volume_limit": 9999999999, "hourly_rate": 4000, "size": "3000*1500*800"},
        ]
        db.bulk_insert_mappings(models.MachineRates, default_rates)
        db.commit()
