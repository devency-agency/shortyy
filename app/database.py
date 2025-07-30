from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

DATABASE = os.environ.get("DATABASE_URL", "[REDACTED]")

Base = declarative_base()
engine = create_engine(DATABASE, echo=False)
Session = sessionmaker(bind=engine)

class URLMapping(Base):
    __tablename__ = 'url_mapping'
    id = Column(Integer, primary_key=True, autoincrement=True)
    short_url = Column(String, unique=True, nullable=False)
    original_url = Column(Text, nullable=False)
    timestamp = Column(DateTime, server_default=func.now())
    client_ip = Column(String)
    expiry = Column(DateTime, nullable=True)
    safe_view_count = Column(Integer, default=0)
    unsafe_view_count = Column(Integer, default=0)

class URLAnalytics(Base):
    __tablename__ = 'url_analytics'
    id = Column(Integer, primary_key=True, autoincrement=True)
    short_url = Column(String, nullable=False)
    client_ip = Column(String, nullable=False)
    timestamp = Column(DateTime, server_default=func.now())
    user_agent = Column(Text)

class Report(Base):
    __tablename__ = 'reports'
    id = Column(Integer, primary_key=True, autoincrement=True)
    original_url = Column(Text, nullable=False)
    timestamp = Column(DateTime, server_default=func.now())

class Admins(Base):
    __tablename__ = 'admins'
    id = Column(Integer, primary_key=True, autoincrement=True)
    user = Column(Text, nullable=False)
    password = Column(Text, nullable=False)
    timestamp = Column(DateTime, server_default=func.now())

def init_db():
    """
    Initialize the database by creating all tables.
    """
    Base.metadata.create_all(engine)
