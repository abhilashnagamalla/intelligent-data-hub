import os
from dotenv import load_dotenv
load_dotenv()
import databases
import asyncio

async def create_table():
    DATABASE_URL = os.getenv('DATABASE_URL')
    database = databases.Database(DATABASE_URL)
    await database.connect()
    query = '''
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
    );
    '''
    await database.execute(query)
    print('Table created')
    await database.disconnect()

asyncio.run(create_table())