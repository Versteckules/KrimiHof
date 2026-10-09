import asyncio
import aiohttp
import json
import subprocess
import time
import urllib.request
import sys

# Ensure UTF-8 output
if sys.stdout.encoding and sys.stdout.encoding.lower() not in ('utf-8', 'utf8'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 9222

async def run_cdp_test():
    print("[1/5] Starte Chrome im Headless-Modus...")
    proc = subprocess.Popen([
        CHROME_PATH,
        "--headless=new",
        f"--remote-debugging-port={PORT}",
        "--disable-gpu",
        "--no-first-run",
        "--no-default-browser-check",
        "--mute-audio",
        "about:blank"
    ])

    try:
        await asyncio.sleep(2)
        # Fetch targets
        resp = urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json")
        targets = json.loads(resp.read().decode())
        page_target = None
        for t in targets:
            if t.get("type") == "page":
                page_target = t
                break
        
        if not page_target:
            print("[FAIL] Keine CDP-Page gefunden!")
            return

        ws_url = page_target["webSocketDebuggerUrl"]
        print(f"[2/5] Verbinde mit CDP WebSocket: {ws_url}")

        console_messages = []
        js_exceptions = []
        network_errors = []

        async with aiohttp.ClientSession() as session:
            async with session.ws_connect(ws_url) as ws:
                msg_id = 1

                async def send_cmd(method, params=None):
                    nonlocal msg_id
                    cmd = {"id": msg_id, "method": method, "params": params or {}}
                    msg_id += 1
                    await ws.send_json(cmd)
                    return cmd["id"]

                # Enable domains
                await send_cmd("Page.enable")
                await send_cmd("Runtime.enable")
                await send_cmd("Console.enable")
                await send_cmd("Network.enable")

                # Navigate to Krimi app
                print("[3/5] Navigiere zu http://localhost:8080/index.html?debug=1 ...")
                await send_cmd("Page.navigate", {"url": "http://localhost:8080/index.html?debug=1"})

                # Read events for 4 seconds
                start_t = time.time()
                while time.time() - start_t < 4.0:
                    try:
                        msg = await asyncio.wait_for(ws.receive_json(), timeout=1.0)
                        method = msg.get("method", "")
                        params = msg.get("params", {})

                        if method == "Runtime.exceptionThrown":
                            exc = params.get("exceptionDetails", {})
                            text = exc.get("text", "")
                            exc_obj = exc.get("exception", {}).get("description", "")
                            js_exceptions.append(f"{text}: {exc_obj}")
                            print(f"  [JS EXCEPTION] {text}: {exc_obj}")

                        elif method == "Console.messageAdded":
                            message = params.get("message", {})
                            level = message.get("level")
                            text = message.get("text")
                            console_messages.append((level, text))
                            if level in ("error", "warning"):
                                print(f"  [CONSOLE {level.upper()}] {text}")

                        elif method == "Network.responseReceived":
                            response = params.get("response", {})
                            status = response.get("status")
                            url = response.get("url")
                            if status >= 400:
                                network_errors.append((status, url))
                                print(f"  [HTTP {status}] {url}")

                    except asyncio.TimeoutError:
                        pass

                print("[4/5] Interaktionstest: Simuliere Ermittler-Eingabe und Start...")
                # Check window.__krimiBooted
                eval_script = """
                (function() {
                    const input = document.getElementById('player-name-input');
                    const btnStart = document.getElementById('btn-start-game');
                    if (input && btnStart) {
                        input.value = "Kommissar Test";
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        btnStart.click();
                        return { ok: true, booted: window.__krimiBooted };
                    }
                    return { ok: false, booted: window.__krimiBooted };
                })()
                """
                await send_cmd("Runtime.evaluate", {"expression": eval_script, "returnByValue": True})

                # Wait another 3 seconds to observe map load & transitions
                start_t = time.time()
                while time.time() - start_t < 3.0:
                    try:
                        msg = await asyncio.wait_for(ws.receive_json(), timeout=1.0)
                        method = msg.get("method", "")
                        params = msg.get("params", {})

                        if method == "Runtime.exceptionThrown":
                            exc = params.get("exceptionDetails", {})
                            text = exc.get("text", "")
                            exc_obj = exc.get("exception", {}).get("description", "")
                            js_exceptions.append(f"{text}: {exc_obj}")
                            print(f"  [JS EXCEPTION] {text}: {exc_obj}")

                        elif method == "Console.messageAdded":
                            message = params.get("message", {})
                            level = message.get("level")
                            text = message.get("text")
                            console_messages.append((level, text))
                            if level in ("error", "warning"):
                                print(f"  [CONSOLE {level.upper()}] {text}")

                        elif method == "Network.responseReceived":
                            response = params.get("response", {})
                            status = response.get("status")
                            url = response.get("url")
                            if status >= 400:
                                network_errors.append((status, url))
                                print(f"  [HTTP {status}] {url}")
                    except asyncio.TimeoutError:
                        pass

                print("[5/5] Test abgeschlossen. Zusammenfassung:")
                print(f"- Total Console Logs: {len(console_messages)}")
                print(f"- Uncaught JS Exceptions: {len(js_exceptions)}")
                print(f"- Network 4xx/5xx Errors: {len(network_errors)}")

    finally:
        print("Beende Chrome...")
        proc.terminate()
        proc.wait()

if __name__ == "__main__":
    asyncio.run(run_cdp_test())
