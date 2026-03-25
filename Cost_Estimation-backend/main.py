
from fastapi import FastAPI
from sqlalchemy.orm import Session

from pathlib import Path



from db import get_db, engine, SessionLocal

import models
from fastapi.middleware.cors import CORSMiddleware

from starlette.middleware.sessions import SessionMiddleware

from try_endpoints import router as try_router
from Milling_process import router as milling_router
from Turning_process import router as turning_router
from utils import init_default_rates
from Composite_process import router as composite_router

from Sheetmetal_process import router as sheetmetal_router


from Sheetmetal_process import router as sheetmetal_router
UPLOAD_DIR = "uploads"
Path(UPLOAD_DIR).mkdir(exist_ok=True)

# Create all tables in the database
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Cost Estimation")
app.include_router(turning_router)
app.include_router(try_router)
app.include_router(milling_router)
app.include_router(sheetmetal_router)
app.include_router(composite_router)

# CORS middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.add_middleware(SessionMiddleware, secret_key="your-secret-key")



@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    init_default_rates(db)
    db.close()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="172.18.100.90", port=8004, reload=True)

#
#uvicorn main:app --host 0.0.0.0 --port 8004 --reload



# uvicorn main:app --host 172.18.100.90 --port 8003 --reload