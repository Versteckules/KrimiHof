import asyncio
import aiohttp
import json
import subprocess
import time
import urllib.request
import sys

if sys.stdout.encoding and sys.stdout.encoding.lower() not in ('utf-8', 'utf8'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

async def test_confirm():
    proc = subprocess.Popen([
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        '--headless=new',
        '--remote-debugging-port=9224',
        '--disable-gpu',
        '--no-first-run',
        '--mute-audio',
        'http://localhost:8080/index.html?debug=1'
    ])
    try:
        await asyncio.sleep(2)
        resp = urllib.request.urlopen('http://127.0.0.1:9224/json')
        targets = json.loads(resp.read().decode())
        ws_url = next(t['webSocketDebuggerUrl'] for t in targets if t.get('type') == 'page')

        async with aiohttp.ClientSession() as s:
            async with s.ws_connect(ws_url) as ws:
                await ws.send_json({'id': 1, 'method': 'Runtime.enable'})
                await asyncio.sleep(1.5)

                test_script = """
                (function() {
                    let called = false;
                    function finishSkip() {
                        called = true;
                    }
                    window.showNoirConfirm("Sensor umgehen?", "Möchtest du das Sprachschloss manuell knacken? (-10 Punkte)", finishSkip);
                    
                    const title = document.getElementById('noir-confirm-title').textContent;
                    const msg = document.getElementById('noir-confirm-message').textContent;
                    const btnYesText = document.getElementById('noir-confirm-yes').textContent;
                    
                    // Click Yes
                    document.getElementById('noir-confirm-yes').click();
                    
                    return {
                        title: title,
                        msg: msg,
                        btnYesText: btnYesText,
                        called: called
                    };
                })()
                """
                await ws.send_json({
                    'id': 2,
                    'method': 'Runtime.evaluate',
                    'params': {'expression': test_script, 'returnByValue': True}
                })

                msg = await ws.receive_json()
                while msg.get('id') != 2:
                    msg = await ws.receive_json()
                res = msg.get('result', {}).get('result', {}).get('value', {})
                print("Testergebnis showNoirConfirm:")
                print("  Titel:      ", res.get('title'))
                print("  Nachricht:  ", res.get('msg'))
                print("  Button-Text:", res.get('btnYesText'))
                print("  Callback aufgerufen:", res.get('called'))
    finally:
        proc.terminate()
        proc.wait()

if __name__ == '__main__':
    asyncio.run(test_confirm())
