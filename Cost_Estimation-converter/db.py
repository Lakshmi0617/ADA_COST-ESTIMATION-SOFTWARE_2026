from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Database connection URL
DATABASE_URL = "postgresql://postgres:root1234@host.docker.internal:5432/Cost_estimation"
# DATABASE_URL = "postgresql://postgres:root1234@host.docker.internal:5432/Cost_estimation"///if we running the command to run docker command which is there in app.py then use this in database url-> host.docker.internal
# DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:12345@localhost:5432/Cost_estimation")

# Create SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,    # ✅ Checks if connection is alive before using it
    pool_recycle=300,      # ✅ Reconnects every 5 minutes to avoid stale connections
    pool_size=5,           # ✅ Max 5 connections in the pool
    max_overflow=10        # ✅ Allow 10 extra temporary connections if needed
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()