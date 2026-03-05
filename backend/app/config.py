from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    DATA_GOV_API_KEY: str

    class Config:
        env_file = ".env"
        extra = "allow"   # 🔥 allow extra env variables safely

settings = Settings()
