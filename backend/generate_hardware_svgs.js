const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../frontend/public/images/products');

function createMacProTowerSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#2c2d35" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#0a0a0d" stop-opacity="1"/>
    </radialGradient>
    <linearGradient id="bodyAlum" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#b0b2b8"/>
      <stop offset="25%" stop-color="#e2e4e9"/>
      <stop offset="70%" stop-color="#f0f2f7"/>
      <stop offset="100%" stop-color="#9a9ca3"/>
    </linearGradient>
    <linearGradient id="handleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#d0d2d8"/>
      <stop offset="100%" stop-color="#7a7c82"/>
    </linearGradient>
    <radialGradient id="holeGrad" cx="40%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#111215"/>
      <stop offset="85%" stop-color="#2a2b30"/>
      <stop offset="100%" stop-color="#555860"/>
    </radialGradient>
  </defs>

  <rect width="800" height="600" fill="url(#bgGlow)"/>

  <!-- Shadow -->
  <ellipse cx="400" cy="535" rx="190" ry="22" fill="#000000" opacity="0.6" filter="blur(14px)"/>

  <!-- Handles (Top) -->
  <path d="M 280 120 L 280 80 A 20 20 0 0 1 300 60 L 500 60 A 20 20 0 0 1 520 80 L 520 120" fill="none" stroke="url(#handleGrad)" stroke-width="18" stroke-linecap="round"/>

  <!-- Feet (Bottom) -->
  <path d="M 280 460 L 280 505 A 18 18 0 0 0 298 523 L 502 523 A 18 18 0 0 0 520 505 L 520 460" fill="none" stroke="url(#handleGrad)" stroke-width="18" stroke-linecap="round"/>

  <!-- Main Chassis Tower -->
  <rect x="275" y="100" width="250" height="380" rx="16" fill="url(#bodyAlum)" stroke="#ffffff" stroke-opacity="0.3" stroke-width="1.5"/>

  <!-- Top Controls: Power Button & Dual Thunderbolt Ports -->
  <circle cx="340" cy="122" r="7" fill="#8e9096" stroke="#ffffff" stroke-width="0.8"/>
  <rect x="420" y="118" width="16" height="8" rx="3" fill="#222" stroke="#666" stroke-width="0.5"/>
  <rect x="450" y="118" width="16" height="8" rx="3" fill="#222" stroke="#666" stroke-width="0.5"/>

  <!-- Cheese Grater Lattice Front (Hexagonal Grid Array) -->
  <g transform="translate(295, 150)">
    ${Array.from({length: 12}).map((_, row) => {
      const cols = row % 2 === 0 ? 9 : 8;
      const offsetX = row % 2 === 0 ? 0 : 12;
      return Array.from({length: cols}).map((_, col) => {
        const cx = offsetX + col * 24 + 10;
        const cy = row * 24 + 10;
        return `<circle cx="${cx}" cy="${cy}" r="7.5" fill="url(#holeGrad)" stroke="#1a1b20" stroke-width="1"/>`;
      }).join('');
    }).join('')}
  </g>

  <!-- Spec Label Overlay -->
  <rect x="290" y="550" width="220" height="28" rx="14" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
  <text x="400" y="569" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">MAC PRO TOWER • M2 ULTRA</text>
</svg>`;
}

function createMacProRackSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#2c2d35" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#0a0a0d" stop-opacity="1"/>
    </radialGradient>
    <linearGradient id="bodyAlum" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f0f2f7"/>
      <stop offset="50%" stop-color="#d2d4da"/>
      <stop offset="100%" stop-color="#9a9ca3"/>
    </linearGradient>
    <linearGradient id="handleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#d0d2d8"/>
      <stop offset="100%" stop-color="#7a7c82"/>
    </linearGradient>
    <radialGradient id="holeGrad" cx="40%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#111215"/>
      <stop offset="85%" stop-color="#2a2b30"/>
      <stop offset="100%" stop-color="#555860"/>
    </radialGradient>
  </defs>

  <rect width="800" height="600" fill="url(#bgGlow)"/>

  <!-- Shadow -->
  <ellipse cx="400" cy="460" rx="310" ry="24" fill="#000000" opacity="0.6" filter="blur(16px)"/>

  <!-- 19-inch Rack Chassis Container -->
  <!-- Left Rack Ear with Mount Holes -->
  <path d="M 120 180 L 170 180 L 170 420 L 120 420 Z" fill="#888a91" stroke="#444" stroke-width="1.5"/>
  <circle cx="140" cy="210" r="5" fill="#111" stroke="#aaa" stroke-width="1"/>
  <circle cx="140" cy="300" r="5" fill="#111" stroke="#aaa" stroke-width="1"/>
  <circle cx="140" cy="390" r="5" fill="#111" stroke="#aaa" stroke-width="1"/>
  <!-- Left Handle -->
  <path d="M 148 230 L 130 230 A 10 10 0 0 0 120 240 L 120 360 A 10 10 0 0 0 130 370 L 148 370" fill="none" stroke="url(#handleGrad)" stroke-width="12" stroke-linecap="round"/>

  <!-- Right Rack Ear with Mount Holes -->
  <path d="M 630 180 L 680 180 L 680 420 L 630 420 Z" fill="#888a91" stroke="#444" stroke-width="1.5"/>
  <circle cx="660" cy="210" r="5" fill="#111" stroke="#aaa" stroke-width="1"/>
  <circle cx="660" cy="300" r="5" fill="#111" stroke="#aaa" stroke-width="1"/>
  <circle cx="660" cy="390" r="5" fill="#111" stroke="#aaa" stroke-width="1"/>
  <!-- Right Handle -->
  <path d="M 652 230 L 670 230 A 10 10 0 0 1 680 240 L 680 360 A 10 10 0 0 1 670 370 L 652 370" fill="none" stroke="url(#handleGrad)" stroke-width="12" stroke-linecap="round"/>

  <!-- Center Rack Unit (5U Enclosure) -->
  <rect x="170" y="190" width="460" height="220" rx="10" fill="url(#bodyAlum)" stroke="#ffffff" stroke-opacity="0.3" stroke-width="1.5"/>

  <!-- Cheese Grater Lattice Horizontal Array -->
  <g transform="translate(190, 215)">
    ${Array.from({length: 6}).map((_, row) => {
      const cols = row % 2 === 0 ? 17 : 16;
      const offsetX = row % 2 === 0 ? 0 : 13;
      return Array.from({length: cols}).map((_, col) => {
        const cx = offsetX + col * 25 + 10;
        const cy = row * 26 + 10;
        return `<circle cx="${cx}" cy="${cy}" r="8.5" fill="url(#holeGrad)" stroke="#1a1b20" stroke-width="1"/>`;
      }).join('');
    }).join('')}
  </g>

  <!-- Top Edge Indicator & Power -->
  <circle cx="210" cy="202" r="4" fill="#ffffff" opacity="0.8"/>
  <rect x="230" y="199" width="12" height="6" rx="2" fill="#222"/>
  <rect x="250" y="199" width="12" height="6" rx="2" fill="#222"/>

  <!-- Spec Label Overlay -->
  <rect x="280" y="500" width="240" height="28" rx="14" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
  <text x="400" y="519" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">MAC PRO RACK • 5U SERVER • M2 ULTRA</text>
</svg>`;
}

fs.writeFileSync(path.join(dir, 'mac-pro-tower.svg'), createMacProTowerSVG());
fs.writeFileSync(path.join(dir, 'mac-pro-rack.svg'), createMacProRackSVG());
console.log('Created mac-pro-tower.svg and mac-pro-rack.svg successfully!');
