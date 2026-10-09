import subprocess
import time
import urllib.request
import json
import socket

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
port = 9222

cmd = [
    chrome_path,
    "--headless=new",
    f"--remote-debugging-port={port}",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "http://localhost:8080/index.html?debug=1"
]

print("Starting headless Chrome...")
proc = subprocess.Popen(cmd)
try:
    time.sleep(2)
    # Get targets from CDP
    try:
        resp = urllib.request.urlopen(f"http://127.0.0.1:{port}/json")
        targets = json.loads(resp.read().decode())
        print(f"CDP Targets: {len(targets)}")
        for t in targets:
            print(f"- {t.get('title')} ({t.get('url')})")
    except Exception as e:
        print("CDP error:", e)
finally:
    proc.terminate()
    proc.wait()
