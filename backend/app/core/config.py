from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET: str

    class Config:
        env_file = ".env"

settings = Settings()
