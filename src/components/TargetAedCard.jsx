import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Navigation, QrCode, MapPin } from 'lucide-react';
import { haversineMeters } from '../data/aedPoints';

export default function TargetAedCard({
  userLat,
  userLng,
  selectedAed,
  actionBoxOpen,
  setActionBoxOpen
}) {
  const [showQr, setShowQr] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);

  const dist = haversineMeters(userLat, userLng, selectedAed.lat, selectedAed.lng);
  const runMin = Math.max(1, Math.round(dist / 160));
  const walkMin = Math.max(1, Math.round(dist / 75));

  const navUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${selectedAed.lat},${selectedAed.lng}&travelmode=walking`;

  const smsBody = encodeURIComponent(
    `PILNE AED! Defibrylator: ${selectedAed.name} (${selectedAed.address}). Miejsce: ${selectedAed.micro}. Trasa: ${navUrl}`
  );

  useEffect(() => {
    if (showQr && canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        navUrl,
        {
          width: 176,
          margin: 1,
          color: {
            dark: '#003366',
            light: '#FFFFFF'
          }
        },
        () => {}
      );
    }
  }, [showQr, navUrl]);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(navUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="lg:col-span-5 bg-white border-2 border-emerald-700 rounded-lg p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 bg-emerald-700 text-white text-xs font-extrabold px-2.5 py-1 rounded uppercase tracking-wide">
          Krok 2 • Najbliższy defibrylator AED
        </span>
        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
          Dostępność: {selectedAed.hours}
        </span>
      </div>

      {/* KLIKALNA KARTA LOKALIZACJI AED */}
      <div
        onClick={() => setActionBoxOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setActionBoxOpen(true)}
        className="group cursor-pointer rounded-lg border-2 border-gray-200 hover:border-[#003366] bg-gray-50/70 hover:bg-blue-50/40 p-3.5 transition"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 group-hover:text-[#003366] transition">
              {selectedAed.name}
            </h2>
            <p className="text-sm text-gray-700 mt-0.5">{selectedAed.address}</p>
          </div>
          <span className="text-xs font-bold text-[#003366] underline shrink-0 mt-1">
            Wybierz opcję &rarr;
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3.5">
          <div className="bg-white border border-gray-200 rounded p-2.5 text-center">
            <div className="text-[11px] font-bold text-gray-500 uppercase">Dystans</div>
            <div className="text-lg sm:text-xl font-extrabold text-emerald-700">
              {dist >= 1000 ? `${(dist / 1000).toFixed(2)} km` : `${dist} m`}
            </div>
          </div>
          <div className="bg-white border border-red-200 rounded p-2.5 text-center">
            <div className="text-[11px] font-bold text-red-700 uppercase">Biegiem</div>
            <div className="text-lg sm:text-xl font-extrabold text-[#D52B1E]">{runMin} min</div>
          </div>
          <div className="bg-white border border-gray-200 rounded p-2.5 text-center">
            <div className="text-[11px] font-bold text-gray-500 uppercase">Marszem</div>
            <div className="text-lg sm:text-xl font-extrabold text-gray-800">{walkMin} min</div>
          </div>
        </div>
      </div>

      {/* MIKROLOKALIZACJA */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-3.5 rounded-r">
        <div className="text-xs font-extrabold uppercase text-amber-900 tracking-wide">
          Dokładne miejsce w budynku (gdzie szukać):
        </div>
        <p className="text-sm font-semibold text-gray-900 mt-1">{selectedAed.micro}</p>
      </div>

      {/* WYBÓR: PROWADŹ PRZEZ MAPY LUB KOD QR */}
      <div className="space-y-2.5 pt-1">
        <button
          onClick={() => setActionBoxOpen(true)}
          className="w-full min-h-[52px] bg-[#003366] hover:bg-[#002244] text-white font-extrabold rounded-md px-4 py-3 text-sm sm:text-base flex items-center justify-center gap-2.5 shadow cursor-pointer transition"
        >
          <Navigation className="w-5 h-5 shrink-0" />
          <span>Prowadź przez Mapy lub Pokaż Kod QR</span>
        </button>

        {actionBoxOpen && (
          <div className="border-2 border-[#003366] rounded-lg p-3.5 bg-blue-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-[#003366]">
                Wybierz sposób działania:
              </span>
              <button
                onClick={() => setActionBoxOpen(false)}
                className="text-xs font-bold text-gray-500 hover:text-gray-800 cursor-pointer"
              >
                Zamknij &times;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <a
                href={navUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[48px] bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-md px-3.5 py-2.5 text-sm flex items-center justify-center gap-2 text-center shadow-xs"
              >
                <MapPin className="w-5 h-5 shrink-0" />
                <span>1. Prowadź przez Mapy</span>
              </a>

              <button
                onClick={() => setShowQr(true)}
                className="min-h-[48px] bg-white hover:bg-gray-100 text-[#003366] border-2 border-[#003366] font-bold rounded-md px-3.5 py-2.5 text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <QrCode className="w-5 h-5 shrink-0" />
                <span>2. Kod QR dla 2. osoby</span>
              </button>
            </div>

            {showQr && (
              <div className="bg-white border border-gray-300 rounded-md p-3.5 text-center space-y-2.5">
                <p className="text-xs font-bold text-gray-800">
                  Druga osoba może zeskanować ten kod aparatem telefonu, aby natychmiast uruchomić nawigację pieszą do tego AED:
                </p>
                <div className="flex justify-center py-1">
                  <canvas ref={canvasRef} />
                </div>
                <div className="flex flex-wrap justify-center gap-2 pt-1">
                  <a
                    href={`sms:?body=${smsBody}`}
                    className="min-h-[42px] px-3.5 py-2 bg-[#003366] text-white text-xs font-bold rounded inline-flex items-center gap-1.5"
                  >
                    Wyślij lokalizację SMS-em
                  </a>
                  <button
                    onClick={handleCopyLink}
                    className="min-h-[42px] px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300 text-xs font-bold rounded cursor-pointer"
                  >
                    Skopiuj link do nawigacji
                  </button>
                </div>
                {copied && (
                  <p className="text-xs font-bold text-emerald-700">
                    Skopiowano link do schowka!
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
