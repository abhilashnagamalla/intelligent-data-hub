from sqlalchemy import Column, Integer, String, JSON, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Domain(Base):
    __tablename__ = "domains"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), unique=True, nullable=False)


class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True)
    domain = Column(String(100))
    metadata_json = Column(JSON)
    source = Column(String(255))
    created_at = Column(DateTime, server_default=func.now())
