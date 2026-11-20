import React, { useState } from 'react';
import { MapPin, LocateFixed } from 'lucide-react';
import { CITY_PRESETS } from '../data/aedPoints';

export default function LocationBar({ locationLabel, onUpdatePosition }) {
  const [selectedCity, setSelectedCity] = useState('warszawa');
  const [gpsStatus, setGpsStatus] = useState(
    'Kliknij przycisk obok, aby pobrać dokładną lokalizację GPS lub kliknij dowolny punkt na mapie.'
  );
  const [gpsStateType, setGpsStateType] = useState('neutral'); // neutral | loading | success | warn
  const [isLocating, setIsLocating] = useState(false);

  const handleRequestGPS = () => {
    if (!navigator.geolocation) {
      setGpsStatus('Twoja przeglądarka nie obsługuje GPS. Kliknij swoje miejsce bezpośrednio na mapie.');
      setGpsStateType('warn');
      return;
    }

    setIsLocating(true);
    setGpsStatus('Trwa ustalanie dokładnych współrzędnych satelitarnych...');
    setGpsStateType('loading');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const acc = Math.round(position.coords.accuracy || 15);
        setIsLocating(false);
        setGpsStatus(`Pozycja GPS pobrana z dokładnością do ok. ${acc} m.`);
        setGpsStateType('success');
        onUpdatePosition(
          lat,
          lng,
          `Twoja aktualna lokalizacja GPS (${lat.toFixed(5)}, ${lng.toFixed(5)})`,
          true
        );
      },
      () => {
        setIsLocating(false);
        setGpsStatus(
          'Brak zgody na GPS lub brak sygnału – kliknij dowolny punkt na mapie albo wybierz miasto z listy.'
        );
        setGpsStateType('warn');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  const handleCityChange = (e) => {
    const key = e.target.value;
    setSelectedCity(key);
    const preset = CITY_PRESETS[key];
    if (preset) {
      setGpsStatus('Wybrano lokalizację miasta. Możesz kliknąć mapę lub pobrać GPS.');
      setGpsStateType('neutral');
      onUpdatePosition(preset.lat, preset.lng, preset.label, true);
    }
  };

  const statusColorClass =
    gpsStateType === 'success'
      ? 'text-emerald-700 font-bold'
      : gpsStateType === 'warn'
      ? 'text-amber-800 font-semibold'
      : 'text-gray-600';

  return (
    <section className="bg-white border-2 border-[#003366] rounded-lg p-3.5 sm:p-5 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-blue-50 border border-blue-200 text-[#003366] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#003366] bg-blue-50 px-2 py-0.5 rounded">
              Krok 1 • Twoja pozycja
            </span>
            <h1 className="text-base sm:text-lg font-extrabold text-gray-900 mt-0.5">
              {locationLabel}
            </h1>
            <p className={`text-xs sm:text-sm ${statusColorClass}`}>{gpsStatus}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <button
            onClick={handleRequestGPS}
            disabled={isLocating}
            className="min-h-[48px] px-5 py-2.5 bg-[#003366] hover:bg-[#002244] active:scale-[0.99] text-white font-bold rounded-md text-sm sm:text-base flex items-center justify-center gap-2 shadow cursor-pointer transition disabled:opacity-75"
          >
            <LocateFixed className="w-5 h-5 shrink-0" />
            <span>{isLocating ? 'Pobieranie sygnału GPS...' : 'Pobierz moją lokalizację GPS'}</span>
          </button>

          <select
            value={selectedCity}
            onChange={handleCityChange}
            aria-label="Wybierz miasto"
            className="min-h-[48px] px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#003366]"
          >
            <option value="warszawa">Warszawa (Centrum)</option>
            <option value="bydgoszcz">Bydgoszcz (Stary Rynek)</option>
            <option value="krakow">Kraków (Rynek Główny)</option>
            <option value="rzeszow">Rzeszów (Rynek)</option>
            <option value="gdansk">Gdańsk (Długi Targ)</option>
            <option value="wroclaw">Wrocław (Rynek)</option>
          </select>
        </div>
      </div>
    </section>
  );
}
