import os
import socket
from dotenv import load_dotenv, set_key

# Load the environment variables from the .env file
load_dotenv()

def find_free_port():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as temp_socket:
        temp_socket.bind(('localhost', 0))
        _, port = temp_socket.getsockname()
        return port

# Find a free port
free_port = find_free_port()

with open('.env', 'w') as file:
    file.write(f"HOST_PORT_FOR_MATLAB_PROXY={free_port}\n")