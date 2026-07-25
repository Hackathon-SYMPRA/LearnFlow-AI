import os
import re

main_path = r'c:\Users\HP\OneDrive\Desktop\HAKETHON_TEAM\LearnFlow-AI\AI-Smart-Education-Assistant\backend\app\main.py'

with open(main_path, 'r') as f:
    content = f.read()

# Add imports
if 'from slowapi' not in content:
    imports = """from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
"""
    # Insert after 'from fastapi import FastAPI'
    content = content.replace('from fastapi import FastAPI', 'from fastapi import FastAPI\n' + imports)

# Add limiter instantiation
if 'limiter = Limiter' not in content:
    limiter_def = "\nlimiter = Limiter(key_func=get_remote_address)\n"
    content = content.replace('app = FastAPI(', limiter_def + 'app = FastAPI(')

# Add limiter exception handler
if 'RateLimitExceeded' not in content or 'app.state.limiter = limiter' not in content:
    limiter_setup = """
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
"""
    content = content.replace('app.add_exception_handler(Exception, global_exception_handler)', 
                              'app.add_exception_handler(Exception, global_exception_handler)\n' + limiter_setup)

with open(main_path, 'w') as f:
    f.write(content)

print("slowapi configured in main.py")
