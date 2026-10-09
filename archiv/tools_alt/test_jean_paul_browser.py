import asyncio
import aiohttp
import json
import subprocess
import time
import urllib.request
import sys

if sys.stdout.encoding and sys.stdout.encoding.lower() not in ('utf-8', 'utf8'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

async def test_jean_paul():
    proc = subprocess.Popen([
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        '--headless=new',
        '--remote-debugging-port=9225',
        '--disable-gpu',
        '--no-first-run',
        '--mute-audio',
        'http://localhost:8080/index.html?debug=1'
    ])
    try:
        await asyncio.sleep(2)
        resp = urllib.request.urlopen('http://127.0.0.1:9225/json')
        targets = json.loads(resp.read().decode())
        ws_url = next(t['webSocketDebuggerUrl'] for t in targets if t.get('type') == 'page')

        async with aiohttp.ClientSession() as s:
            async with s.ws_connect(ws_url) as ws:
                await ws.send_json({'id': 1, 'method': 'Runtime.enable'})
                await ws.send_json({'id': 2, 'method': 'Console.enable'})
                await asyncio.sleep(1.5)

                test_script = """
                (async function() {
                    const stModule = await import('./js/ui/station.js');
                    stModule.openStation('jean_paul');
                    
                    const charCard = document.querySelector('#station-characters-container .character-card');
                    if (charCard) {
                        charCard.click();
                    }
                    
                    await new Promise(r => setTimeout(r, 300));
                    
                    const dialogueViewHidden = document.getElementById('view-dialogue').classList.contains('hidden');
                    const dialogueName = document.getElementById('dialogue-name').textContent;
                    
                    return {
                        dialogueOpened: !dialogueViewHidden,
                        speakerName: dialogueName
                    };
                })()
                """
                await ws.send_json({
                    'id': 3,
                    'method': 'Runtime.evaluate',
                    'params': {'expression': test_script, 'awaitPromise': True, 'returnByValue': True}
                })

                msg = await ws.receive_json()
                while msg.get('id') != 3:
                    msg = await ws.receive_json()
                res = msg.get('result', {}).get('result', {}).get('value', {})
                print("Testergebnis Dialog Jean Paul:")
                print("  Dialog geöffnet: ", res.get('dialogueOpened'))
                print("  Sprecher:        ", res.get('speakerName'))
    finally:
        proc.terminate()
        proc.wait()

if __name__ == '__main__':
    asyncio.run(test_jean_paul())
