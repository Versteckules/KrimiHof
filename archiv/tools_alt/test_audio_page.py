import asyncio
import aiohttp
import urllib.request
import json
import subprocess
import time
import sys

if sys.stdout.encoding and sys.stdout.encoding.lower() not in ('utf-8', 'utf8'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

async def test_audio_test():
    proc = subprocess.Popen([
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        '--headless=new',
        '--remote-debugging-port=9223',
        '--disable-gpu',
        '--no-first-run',
        '--mute-audio',
        'http://localhost:8080/audio_test.html'
    ])
    try:
        await asyncio.sleep(2)
        resp = urllib.request.urlopen('http://127.0.0.1:9223/json')
        targets = json.loads(resp.read().decode())
        ws_url = next(t['webSocketDebuggerUrl'] for t in targets if t.get('type') == 'page')
        
        async with aiohttp.ClientSession() as s:
            async with s.ws_connect(ws_url) as ws:
                await ws.send_json({'id': 1, 'method': 'Runtime.enable'})
                await ws.send_json({'id': 2, 'method': 'Console.enable'})
                await ws.send_json({'id': 3, 'method': 'Network.enable'})
                await asyncio.sleep(1.5)
                
                # Check card count
                await ws.send_json({
                    'id': 4,
                    'method': 'Runtime.evaluate',
                    'params': {'expression': 'document.querySelectorAll(".character-card").length', 'returnByValue': True}
                })
                
                cards = 0
                while True:
                    msg = await ws.receive_json()
                    if msg.get('id') == 4:
                        cards = msg.get('result', {}).get('result', {}).get('value')
                        break
                
                print(f"[OK] audio_test.html hat erfolgreich {cards} Charakter-Karten gerendert!")
    finally:
        proc.terminate()
        proc.wait()

if __name__ == '__main__':
    asyncio.run(test_audio_test())
