import socket
import time
import os
import sys

# Ensure psutil is installed
try:
    import psutil
except ImportError:
    print("psutil not found. Installing it now...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "psutil"])
    import psutil

# Configuration
GRAPHITE_HOST = 'localhost'
GRAPHITE_PORT = 2003
INTERVAL = 5 # seconds

def get_system_uptime():
    # Return system uptime in seconds
    return time.time() - psutil.boot_time()

def collect_metrics():
    # Gather CPU, Memory, Disk, Network, and Uptime metrics
    cpu_percent = psutil.cpu_percent(interval=None)
    memory = psutil.virtual_memory()
    disk = psutil.disk_usage('/')
    net_io = psutil.net_io_counters()
    
    timestamp = int(time.time())
    
    metrics = [
        f"system.cpu.usage {cpu_percent} {timestamp}",
        f"system.memory.usage_percent {memory.percent} {timestamp}",
        f"system.memory.available {memory.available} {timestamp}",
        f"system.disk.usage_percent {disk.percent} {timestamp}",
        f"system.network.bytes_sent {net_io.bytes_sent} {timestamp}",
        f"system.network.bytes_recv {net_io.bytes_recv} {timestamp}",
        f"system.uptime {get_system_uptime()} {timestamp}"
    ]
    return "\n".join(metrics) + "\n"

def main():
    print(f"Starting Graphite Metric Reporter. Target: {GRAPHITE_HOST}:{GRAPHITE_PORT}")
    print("Press Ctrl+C to stop.")
    
    while True:
        try:
            # Establish short-lived TCP connection to Carbon receiver
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(5.0)
            sock.connect((GRAPHITE_HOST, GRAPHITE_PORT))
            
            payload = collect_metrics()
            sock.sendall(payload.encode('utf-8'))
            sock.close()
            
            print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Metrics sent successfully.")
        except ConnectionRefusedError:
            print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Connection refused by Graphite (is Docker stack running?). Retrying...")
        except Exception as e:
            print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Error: {e}")
            
        time.sleep(INTERVAL)

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\nMetric Reporter stopped.")
        sys.exit(0)
