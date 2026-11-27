const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9222;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  // Launch Chrome
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
    console.log("Connected to Chrome WebSocket:", wsUrl);

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
      deviceScaleFactor: 2, // Retina 2x high resolution!
      mobile: false
    });

    const views = [
      { tab: 'dashboard', name: 'dashboard.png' },
      { tab: 'floorplan', name: 'floorplan_radar.png' },
      { tab: 'pos', name: 'pos_checkout.png' },
      { tab: 'inventory', name: 'inventory.png' },
      { tab: 'workforce', name: 'specialist_workforce.png' },
      { tab: 'analytics', name: 'executive_analytics.png' },
      { tab: 'genius', name: 'genius_bar.png' },
      { tab: 'transfers', name: 'supply_chain.png' }
    ];

    for (const v of views) {
      console.log(`Navigating to tab: ${v.tab}...`);
      await sendCommand('Page.navigate', { url: `http://localhost:5001/?tab=${v.tab}` });
      // Wait for network requests to finish and React components to fully render
      await sleep(2500);

      // Verify DOM loaded
      const evalRes = await sendCommand('Runtime.evaluate', {
        expression: 'document.body.innerText.length'
      });
      console.log(`Tab ${v.tab} rendered text length:`, evalRes.result?.value);

      const shotRes = await sendCommand('Page.captureScreenshot', { format: 'png' });
      const imgBuffer = Buffer.from(shotRes.data, 'base64');
      const outPath = path.join(__dirname, 'docs/screenshots', v.name);
      fs.writeFileSync(outPath, imgBuffer);
      console.log(`Saved screenshot: ${outPath} (${(imgBuffer.length / 1024).toFixed(1)} KB)`);
    }

    ws.close();
  } finally {
    chromeProc.kill();
  }
}

run().then(() => {
  console.log("All screenshots captured successfully!");
  process.exit(0);
}).catch(err => {
  console.error("Error capturing screenshots:", err);
  process.exit(1);
});
