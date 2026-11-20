import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#002244] text-white mt-10 border-t-4 border-[#D52B1E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-blue-100">
        <div>
          <p className="font-bold text-white text-sm">
            gov.pl • Serwis Rzeczypospolitej Polskiej
          </p>
          <p className="mt-1">
            Projekt edukacyjno-ratunkowy wykorzystujący otwarte dane publiczne (dane.gov.pl). W stanie zagrożenia życia zawsze dzwoń pod numer alarmowy{' '}
            <strong>112</strong> lub <strong>999</strong>.
          </p>
        </div>
        <div className="shrink-0">
          <a
            href="tel:112"
            className="inline-block bg-[#D52B1E] text-white font-extrabold px-4 py-2 rounded"
          >
            Alarmowy: 112
          </a>
        </div>
      </div>
    </footer>
  );
}
