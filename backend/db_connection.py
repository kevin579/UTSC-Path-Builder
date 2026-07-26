import mysql.connector
from sshtunnel import SSHTunnelForwarder
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def get_db_connection():
    """
    Establishes an SSH tunnel and connects to a MySQL database using credentials from environment variables.
    """

    # Create SSH tunnel using environment variables
    tunnel = SSHTunnelForwarder(
        (os.getenv("SSH_HOST"), int(os.getenv("SSH_PORT"))),
        ssh_username=os.getenv("SSH_USER"),
        ssh_password=os.getenv("SSH_PASSWORD"),
        remote_bind_address=(os.getenv("DB_HOST"), int(os.getenv("DB_PORT")))
    )

    # Start the SSH tunnel
    tunnel.start()

    # Connect to MySQL through the SSH tunnel
    connection = mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        port=tunnel.local_bind_port,
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )

    return connection
