import React from "react";
import X from "lucide-react/dist/esm/icons/x.js";
import Download from "lucide-react/dist/esm/icons/download.js";
import Printer from "lucide-react/dist/esm/icons/printer.js";
import QrCode from "lucide-react/dist/esm/icons/qr-code.js";
import ShieldCheck from "lucide-react/dist/esm/icons/shield-check.js";
import Check from "lucide-react/dist/esm/icons/check.js";

export function DigitalWalletPassModal({ isOpen, onClose, passData, saleId }) {
  if (!isOpen || !passData) return null;

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(passData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ApplePass-${passData.serialNumber || saleId}.pkpass.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn text-zinc-100">
      <div className="bg-zinc-950 rounded-3xl border border-white/10 shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Top Dismiss Bar */}
        <div className="p-4 px-6 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Apple Wallet Pass & Digital Receipt</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Apple Wallet Pass Container (.pkpass visual style) */}
        <div className="p-6">
          <div className="rounded-2xl bg-zinc-900 border border-white/15 p-6 shadow-2xl relative overflow-hidden space-y-5">
            {/* Gloss sheen header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                {/* Minimal Apple Logo */}
                <svg className="w-4 h-4 fill-white" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.6-7.7-11.71-13.98-5.55-8.47-9.97-18.47-13.25-30-3.28-11.53-4.92-22.37-4.92-32.53 0-14.36 3.56-26.05 10.67-35.08 7.12-9.03 16.21-13.67 27.28-13.91 4.79 0 10.15 1.34 16.08 4.02 5.93 2.68 9.77 4.08 11.52 4.18 1.45-.1 5.37-1.55 11.77-4.34 6.4-2.8 11.71-4.08 15.93-3.86 12.18.73 21.73 5.4 28.64 14.02-10.74 6.53-15.99 15.65-15.75 27.35.24 9.17 3.86 16.92 10.86 23.23 7 6.31 15.02 9.87 24.06 10.68-2.18 6.53-4.8 12.63-7.85 18.3zM119.22 31.96c0-7.39 2.68-14.28 8.04-20.67 5.36-6.38 12.07-10.45 20.14-12.21.36 1.45.54 2.8.54 4.03 0 7.4-2.73 14.39-8.19 20.97-5.46 6.58-12.39 10.6-20.78 12.06.07-1.42.25-2.82.25-4.18z"/>
                </svg>
                <span className="font-semibold text-xs text-white tracking-wider uppercase font-mono">Apple Store</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono">PASS # {passData.serialNumber}</span>
            </div>

            {/* Primary Hardware */}
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                {passData.primaryFields?.[0]?.label || "PURCHASED HARDWARE"}
              </span>
              <h3 className="text-base font-bold text-white mt-0.5 tracking-tight">
                {passData.primaryFields?.[0]?.value}
              </h3>
            </div>

            {/* Secondary: Total & Payment */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">TOTAL CHARGED</span>
                <div className="text-lg font-black font-mono text-emerald-400 mt-0.5">
                  {passData.secondaryFields?.[0]?.value}
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">PAYMENT</span>
                <div className="text-xs font-semibold text-white mt-1">
                  {passData.secondaryFields?.[1]?.value}
                </div>
              </div>
            </div>

            {/* Auxiliary Details */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-[10px]">
              <div>
                <span className="text-zinc-500 block uppercase font-mono">STORE</span>
                <span className="text-zinc-300 font-medium truncate block">{passData.auxiliaryFields?.[0]?.value}</span>
              </div>
              <div>
                <span className="text-zinc-500 block uppercase font-mono">SPECIALIST</span>
                <span className="text-zinc-300 font-medium truncate block">{passData.auxiliaryFields?.[1]?.value}</span>
              </div>
              <div>
                <span className="text-zinc-500 block uppercase font-mono">DATE</span>
                <span className="text-zinc-300 font-medium truncate block">{passData.auxiliaryFields?.[2]?.value}</span>
              </div>
            </div>

            {/* Barcode & QR Code Section */}
            <div className="pt-4 border-t border-white/10 flex flex-col items-center justify-center space-y-2 bg-white p-4 rounded-xl">
              {/* Dynamic SVG QR Code Pattern */}
              <div className="w-32 h-32 flex items-center justify-center bg-white p-2">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-black">
                  {/* Outer corner anchors */}
                  <rect x="5" y="5" width="25" height="25" fill="black"/>
                  <rect x="8" y="8" width="19" height="19" fill="white"/>
                  <rect x="11" y="11" width="13" height="13" fill="black"/>

                  <rect x="70" y="5" width="25" height="25" fill="black"/>
                  <rect x="73" y="8" width="19" height="19" fill="white"/>
                  <rect x="76" y="11" width="13" height="13" fill="black"/>

                  <rect x="5" y="70" width="25" height="25" fill="black"/>
                  <rect x="8" y="73" width="19" height="19" fill="white"/>
                  <rect x="11" y="76" width="13" height="13" fill="black"/>

                  {/* QR Matrix Bits */}
                  <rect x="35" y="10" width="6" height="6"/>
                  <rect x="45" y="10" width="6" height="6"/>
                  <rect x="55" y="10" width="6" height="6"/>
                  <rect x="35" y="20" width="6" height="6"/>
                  <rect x="50" y="20" width="6" height="6"/>
                  <rect x="10" y="35" width="6" height="6"/>
                  <rect x="20" y="35" width="6" height="6"/>
                  <rect x="35" y="35" width="6" height="6"/>
                  <rect x="45" y="35" width="6" height="6"/>
                  <rect x="55" y="35" width="6" height="6"/>
                  <rect x="65" y="35" width="6" height="6"/>
                  <rect x="75" y="35" width="6" height="6"/>
                  <rect x="85" y="35" width="6" height="6"/>
                  <rect x="35" y="50" width="6" height="6"/>
                  <rect x="45" y="50" width="6" height="6"/>
                  <rect x="65" y="50" width="6" height="6"/>
                  <rect x="75" y="50" width="6" height="6"/>
                  <rect x="35" y="65" width="6" height="6"/>
                  <rect x="50" y="65" width="6" height="6"/>
                  <rect x="65" y="65" width="6" height="6"/>
                  <rect x="80" y="65" width="6" height="6"/>
                  <rect x="35" y="80" width="6" height="6"/>
                  <rect x="45" y="80" width="6" height="6"/>
                  <rect x="60" y="80" width="6" height="6"/>
                  <rect x="75" y="80" width="6" height="6"/>
                  <rect x="85" y="80" width="6" height="6"/>
                </svg>
              </div>
              <span className="text-[10px] text-zinc-600 font-mono tracking-widest font-semibold">
                SCAN WITH IPHONE CAMERA
              </span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 px-6 bg-zinc-900 border-t border-white/5 flex items-center justify-between gap-3 text-xs">
          <button
            onClick={handlePrint}
            className="btn-apple-secondary flex-1 py-2 rounded-xl text-zinc-300 hover:text-white flex items-center justify-center gap-2"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
          <button
            onClick={handleDownloadJSON}
            className="btn-apple-primary flex-1 py-2 rounded-xl text-black font-semibold flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Pass</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DigitalWalletPassModal;
