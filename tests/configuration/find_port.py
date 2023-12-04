import os
import socket

# Load the environment variables from the .env file
def find_free_port():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as temp_socket:
        temp_socket.bind(('localhost', 0))
        _, port = temp_socket.getsockname()
        return port

# Find a free port
free_port = find_free_port()

with open(os.path.join(os.path.dirname(__file__),'.env'), 'w') as file:
    file.write(f"FREE_PORT={free_port}\n")