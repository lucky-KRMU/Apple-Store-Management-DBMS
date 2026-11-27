const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9223;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,900',
    'about:blank'
  ]);

  await sleep(1500);

  try {
    const listRes = await fetch(`http://127.0.0.1:${PORT}/json/list`);
    const tabs = await listRes.json();
    const wsUrl = tabs[0]?.webSocketDebuggerUrl;

    const ws = new WebSocket(wsUrl);
    await new Promise(resolve => ws.onopen = resolve);

    let id = 1;
    function sendCommand(method, params = {}) {
      return new Promise((resolve, reject) => {
        const msgId = id++;
        const handler = (evt) => {
          const res = JSON.parse(evt.data);
          if (res.id === msgId) {
            ws.removeEventListener('message', handler);
            if (res.error) reject(res.error);
            else resolve(res.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await sendCommand('Page.enable');
    await sendCommand('Runtime.enable');
    await sendCommand('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2,
      mobile: false
    });

    // 1. Capture Till Reconciliation Modal
    console.log("Navigating for Till Reconciliation Modal...");
    await sendCommand('Page.navigate', { url: 'http://localhost:5001/?tab=dashboard' });
    await sleep(2000);

    // Click "Till & Vault" button in navbar
    await sendCommand('Runtime.evaluate', {
      expression: `
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Till & Vault'));
        if (btn) btn.click();
      `
    });
    await sleep(1000);

    const tillShot = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, 'docs/screenshots/till_reconciliation_modal.png'), Buffer.from(tillShot.data, 'base64'));
    console.log("Saved till_reconciliation_modal.png");

    // 2. Capture Trade-in Diagnostics Modal
    console.log("Navigating for Trade-In Diagnostics Modal...");
    await sendCommand('Page.navigate', { url: 'http://localhost:5001/?tab=pos' });
    await sleep(2000);

    // Click "+ Add Trade-In"
    await sendCommand('Runtime.evaluate', {
      expression: `
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Add Trade-In'));
        if (btn) btn.click();
      `
    });
    await sleep(500);

    // Click "Run Trade-In Diagnostics"
    await sendCommand('Runtime.evaluate', {
      expression: `
        const diagBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Diagnostics'));
        if (diagBtn) diagBtn.click();
      `
    });
    await sleep(1000);

    const diagShot = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, 'docs/screenshots/trade_in_diagnostics_modal.png'), Buffer.from(diagShot.data, 'base64'));
    console.log("Saved trade_in_diagnostics_modal.png");

    ws.close();
  } finally {
    chromeProc.kill();
  }
}

run().then(() => {
  console.log("Modal screenshots captured!");
  process.exit(0);
}).catch(err => {
  console.error("Modal capture error:", err);
  process.exit(1);
});
