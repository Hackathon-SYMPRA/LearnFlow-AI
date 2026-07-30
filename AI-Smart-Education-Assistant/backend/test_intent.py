import asyncio
import os
import sys

# Add backend dir to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.ai.agent_parser import agent_parser

async def main():
    sys.stdout.reconfigure(encoding='utf-8')
    print('Testing Marathi:')
    try:
        res = await agent_parser.parse_intent('माझ्या सिलेक्टेड डॉक्युमेंट मधून नोट्स जनरेट करा', '/notes')
        print(res)
    except Exception as e:
        print('Error:', e)
        
    print('\nTesting English:')
    try:
        res2 = await agent_parser.parse_intent('generate notes from my selected document', '/notes')
        print(res2)
    except Exception as e:
        print('Error:', e)

asyncio.run(main())
