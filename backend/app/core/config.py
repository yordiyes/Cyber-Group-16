from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str = "iMf1AVhxCwwps8WU"

    class Config:
        env_file = ".env"

settings = Settings()
