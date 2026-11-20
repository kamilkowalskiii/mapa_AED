import React, { useState } from 'react';
import { AED_POINTS } from '../data/aedPoints';

export default function OpenDataPortal({ onFocusAed }) {
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('all');

  const filtered = AED_POINTS.filter((pt) => {
    const matchCity = cityFilter === 'all' || pt.city === cityFilter;
    const q = search.toLowerCase();
    const matchText =
      !q ||
      pt.name.toLowerCase().includes(q) ||
      pt.address.toLowerCase().includes(q) ||
      pt.micro.toLowerCase().includes(q);
    return matchCity && matchText;
  });

  const exportData = (format) => {
    let content = '';
    let mime = 'text/plain;charset=utf-8';
    const filename = `rejestr_aed_gov_pl.${format}`;

    if (format === 'json') {
      const geojson = {
        type: 'FeatureCollection',
        features: AED_POINTS.map((pt) => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [pt.lng, pt.lat] },
          properties: {
            id: pt.id,
            city: pt.city,
            name: pt.name,
            address: pt.address,
            micro: pt.micro,
            hours: pt.hours
          }
        }))
      };
      content = JSON.stringify(geojson, null, 2);
      mime = 'application/geo+json;charset=utf-8';
    } else {
      const header = 'id;miasto;nazwa;adres;mikrolokalizacja;godziny;lat;lng';
      const rows = AED_POINTS.map(
        (p) =>
          `${p.id};"${p.city}";"${p.name}";"${p.address}";"${p.micro}";"${p.hours}";${p.lat};${p.lng}`
      );
      content = '\uFEFF' + [header, ...rows].join('\n');
      mime = 'text/csv;charset=utf-8';
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="bg-white border border-gray-300 rounded-lg p-4 sm:p-6 shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#003366]">
            Publiczny Rejestr Defibrylatorów AED (dane.gov.pl)
          </h2>
          <p className="text-sm text-gray-600">
            Zestawienie 44 zweryfikowanych lokalizacji AED w Polsce (w tym 14 punktów w Bydgoszczy).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => exportData('json')}
            className="min-h-[42px] px-4 py-2 bg-[#003366] hover:bg-[#002244] text-white text-xs sm:text-sm font-bold rounded cursor-pointer"
          >
            Pobierz GeoJSON
          </button>
          <button
            onClick={() => exportData('csv')}
            className="min-h-[42px] px-4 py-2 bg-white hover:bg-gray-100 text-[#003366] border border-[#003366] text-xs sm:text-sm font-bold rounded cursor-pointer"
          >
            Pobierz CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Szukaj po nazwie, ulicy lub miejscu..."
          className="min-h-[44px] px-3.5 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#003366] sm:col-span-2"
        />
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="min-h-[44px] px-3.5 py-2 border border-gray-300 rounded-md text-sm font-semibold bg-white"
        >
          <option value="all">Wszystkie miasta (44)</option>
          <option value="Bydgoszcz">Bydgoszcz (14)</option>
          <option value="Warszawa">Warszawa (8)</option>
          <option value="Kraków">Kraków (6)</option>
          <option value="Rzeszów">Rzeszów (6)</option>
          <option value="Gdańsk">Gdańsk (5)</option>
          <option value="Wrocław">Wrocław (5)</option>
        </select>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#003366] text-white text-xs uppercase">
            <tr>
              <th className="px-4 py-3">Miasto</th>
              <th className="px-4 py-3">Obiekt / Lokalizacja</th>
              <th className="px-4 py-3">Mikrolokalizacja</th>
              <th className="px-4 py-3">Dostępność</th>
              <th className="px-4 py-3 text-right">Akcja</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filtered.map((pt) => (
              <tr key={pt.id} className="hover:bg-blue-50/40">
                <td className="px-4 py-3 font-bold text-[#003366]">{pt.city}</td>
                <td className="px-4 py-3">
                  <div className="font-bold text-gray-900">{pt.name}</div>
                  <div className="text-xs text-gray-500">{pt.address}</div>
                </td>
                <td className="px-4 py-3 text-xs text-gray-700">{pt.micro}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 text-xs font-bold rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {pt.hours}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onFocusAed(pt)}
                    className="px-3 py-1.5 bg-[#003366] text-white text-xs font-bold rounded hover:bg-[#002244] cursor-pointer"
                  >
                    Pokaż na mapie
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
