import React from 'react';
import { PhoneCall } from 'lucide-react';

export default function Header({ activeTab, onTabChange }) {
  return (
    <header className="bg-white border-b-4 border-[#D52B1E] shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-11 rounded bg-[#D52B1E] flex items-center justify-center shrink-0"
              aria-hidden="true"
            >
              <svg viewBox="0 0 40 44" className="w-7 h-8 fill-white">
                <path d="M20 4c-1.5 0-2.5 1-2.5 2.2 0 .8.4 1.4 1 1.8l-1.5 2.5c-3.5-.8-7.5.5-10 3.5l3 1.5c-1.8 1.5-2.8 3.8-2.5 6.2l3.2-.5c-.8 2-.5 4.2.8 5.8l2.5-1.8c.5 2.2 2 4 4 4.8v4.5l-3 2.5h10l-3-2.5V30c2-.8 3.5-2.6 4-4.8l2.5 1.8c1.3-1.6 1.6-3.8.8-5.8l3.2.5c.3-2.4-.7-4.7-2.5-6.2l3-1.5c-2.5-3-6.5-4.3-10-3.5L21.5 8c.6-.4 1-1 1-1.8C22.5 5 21.5 4 20 4z" />
              </svg>
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#1A202C]">
                  gov.pl
                </span>
                <span className="hidden sm:inline-block h-5 w-[1px] bg-gray-300" />
                <span className="hidden sm:inline-block text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Serwis Rzeczypospolitej Polskiej
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#003366]">
                MISJA AED – Dane na Ratunek (Ministerstwo Cyfryzacji)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="tel:112"
            className="pulse-ring inline-flex items-center gap-2 bg-[#D52B1E] hover:bg-[#B32015] text-white font-extrabold px-3.5 sm:px-5 py-2.5 rounded-md text-sm sm:text-base shadow transition"
          >
            <PhoneCall className="w-5 h-5 shrink-0" />
            <span>ZADZWOŃ 112</span>
          </a>
        </div>
      </div>

      <div className="bg-[#003366] text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between text-xs sm:text-sm">
          <nav className="flex">
            <button
              onClick={() => onTabChange('rescue')}
              className={`px-4 py-2.5 transition cursor-pointer ${
                activeTab === 'rescue'
                  ? 'font-bold bg-white text-[#003366] border-t-2 border-[#D52B1E]'
                  : 'font-semibold text-white/90 hover:bg-[#002244]'
              }`}
            >
              Tryb Ratunkowy (Mapa + RKO)
            </button>
            <button
              onClick={() => onTabChange('data')}
              className={`px-4 py-2.5 transition cursor-pointer ${
                activeTab === 'data'
                  ? 'font-bold bg-white text-[#003366] border-t-2 border-[#D52B1E]'
                  : 'font-semibold text-white/90 hover:bg-[#002244]'
              }`}
            >
              Baza Otwartych Danych (dane.gov.pl)
            </button>
          </nav>
          <span className="hidden md:inline text-xs text-blue-100">
            Rejestr publiczny defibrylatorów AED • Aktualizacja: 2026
          </span>
        </div>
      </div>
    </header>
  );
}
