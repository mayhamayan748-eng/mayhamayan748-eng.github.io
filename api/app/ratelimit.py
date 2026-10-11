import hashlib

from fastapi import Request
from slowapi import Limiter

from app.config import get_settings


def client_ip(request: Request) -> str:
    # Uvicorn runs with --proxy-headers on Render, so request.client is the real visitor.
    return request.client.host if request.client else "unknown"


def hash_ip(ip: str) -> str:
    return hashlib.sha256(f"{get_settings().ip_hash_salt}:{ip}".encode()).hexdigest()


limiter = Limiter(key_func=lambda request: hash_ip(client_ip(request)))
