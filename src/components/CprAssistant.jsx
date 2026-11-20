import React, { useEffect, useRef, useState } from 'react';
import { Play, Square } from 'lucide-react';
import { CPR_GUIDES } from '../data/aedPoints';

export default function CprAssistant() {
  const [cprMode, setCprMode] = useState('adult');
  const [isRunning, setIsRunning] = useState(false);
  const [beatCount, setBeatCount] = useState(0);
  const [pulseActive, setPulseActive] = useState(false);

  const audioCtxRef = useRef(null);
  const intervalRef = useRef(null);

  const playBeep = (isAccent) => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = isAccent ? 880 : 660;
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Ignoruj ograniczenia audio jeśli występują
    }
  };

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setBeatCount(0);
      setPulseActive(false);
      return;
    }

    let current = 0;
    const tick = () => {
      current = (current % 30) + 1;
      setBeatCount(current);
      playBeep(current === 1 || current === 30);
      setPulseActive(true);
      setTimeout(() => setPulseActive(false), 110);
    };

    tick();
    intervalRef.current = setInterval(tick, Math.round(60000 / 110));

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  return (
    <section className="bg-white border border-gray-300 rounded-lg p-4 sm:p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-gray-200">
        <div>
          <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#D52B1E] bg-red-50 px-2 py-0.5 rounded">
            Krok 3 • Pierwsza pomoc przed przyjazdem karetki
          </span>
          <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 mt-1">
            Instrukcja resuscytacji krążeniowo-oddechowej (RKO)
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-md border border-gray-300 overflow-hidden">
            <button
              onClick={() => setCprMode('adult')}
              className={`min-h-[42px] px-3.5 py-1.5 text-xs sm:text-sm font-bold cursor-pointer ${
                cprMode === 'adult'
                  ? 'bg-[#003366] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Dorosły
            </button>
            <button
              onClick={() => setCprMode('child')}
              className={`min-h-[42px] px-3.5 py-1.5 text-xs sm:text-sm font-bold cursor-pointer ${
                cprMode === 'child'
                  ? 'bg-[#003366] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Dziecko
            </button>
          </div>

          <button
            onClick={() => setIsRunning((prev) => !prev)}
            className={`cpr-beat min-h-[44px] px-4 py-2 rounded-md bg-[#D52B1E] hover:bg-[#B32015] text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow cursor-pointer ${
              pulseActive ? 'active' : ''
            }`}
          >
            {isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>
              {!isRunning
                ? 'Uruchom rytm 110/min'
                : beatCount === 30
                ? '30! (2 oddechy)'
                : `Ucisk: ${beatCount} / 30`}
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-4">
        {CPR_GUIDES[cprMode].map((item) => (
          <div key={item.step} className="border border-gray-200 rounded-lg p-3.5 bg-gray-50">
            <div className="font-extrabold text-sm text-[#003366]">{item.step}</div>
            <p className="text-xs sm:text-sm text-gray-700 mt-1.5 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
