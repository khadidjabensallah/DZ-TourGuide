"""
Simple database shell using psycopg2
Run: python db_shell.py
"""
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database connection settings
DB_NAME = os.environ.get('DATABASE_NAME', 'dz_tourguide')
DB_USER = os.environ.get('DATABASE_USER', 'dz_user')
DB_PASSWORD = os.environ.get('DATABASE_PASSWORD', 'dz_tourguide5')
DB_HOST = os.environ.get('DATABASE_HOST', 'localhost')
DB_PORT = os.environ.get('DATABASE_PORT', '5432')

try:
    import psycopg2
    from psycopg2 import sql
    
    print(f"Connecting to database: {DB_NAME} on {DB_HOST}:{DB_PORT}")
    print(f"User: {DB_USER}")
    print("-" * 50)
    
    # Connect to database
    conn = psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )
    
    print("Connected successfully!")
    print("Type SQL commands (or 'exit' to quit)")
    print("-" * 50)
    
    cur = conn.cursor()
    
    while True:
        try:
            # Get input
            command = input("dz_tourguide=# ")
            
            if command.strip().lower() in ['exit', 'quit', '\\q']:
                break
            
            if not command.strip():
                continue
            
            # Execute command
            cur.execute(command)
            
            # Check if it's a SELECT or similar that returns data
            if command.strip().upper().startswith('SELECT'):
                results = cur.fetchall()
                if results:
                    # Get column names
                    colnames = [desc[0] for desc in cur.description]
                    print("\n".join(["\t".join(map(str, row)) for row in [colnames] + results]))
                else:
                    print("(0 rows)")
            else:
                # For INSERT, UPDATE, DELETE, etc.
                conn.commit()
                print(f"Command executed. Rows affected: {cur.rowcount}")
            
            print()
            
        except KeyboardInterrupt:
            print("\nExiting...")
            break
        except Exception as e:
            print(f"Error: {e}")
            conn.rollback()
    
    cur.close()
    conn.close()
    print("Connection closed.")
    
except ImportError:
    print("Error: psycopg2 is not installed.")
    print("Install it with: pip install psycopg2-binary")
    sys.exit(1)
except psycopg2.OperationalError as e:
    print(f"Error connecting to database: {e}")
    print("\nMake sure:")
    print("1. PostgreSQL is running")
    print("2. Database credentials are correct in .env file")
    print("3. Database exists")
    sys.exit(1)

