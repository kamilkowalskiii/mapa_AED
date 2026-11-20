import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

export default function AedMap({
  userLat,
  userLng,
  pointsWithDist,
  selectedAed,
  onSelectAed,
  onUserMove
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const streetLayerRef = useRef(null);
  const satLayerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const markersLayerRef = useRef(null);
  const routeLineRef = useRef(null);

  const [basemap, setBasemap] = useState('street');

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, { zoomControl: true }).setView(
      [userLat, userLng],
      16
    );
    mapInstanceRef.current = map;

    const streetLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Map data &copy; Esri, OpenStreetMap contributors | dane.gov.pl',
        maxZoom: 19
      }
    );

    const satLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Imagery &copy; Esri | dane.gov.pl',
        maxZoom: 19
      }
    );

    const osmHotFallback = L.tileLayer(
      'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenStreetMap contributors, HOT',
        maxZoom: 19
      }
    );

    streetLayer.on('tileerror', () => {
      if (!map.hasLayer(osmHotFallback)) {
        osmHotFallback.addTo(map);
      }
    });

    streetLayer.addTo(map);
    streetLayerRef.current = streetLayer;
    satLayerRef.current = satLayer;

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;

    const userIcon = L.divIcon({
      className: '',
      html: `<div style="width:22px;height:22px;background:#2563EB;border:3px solid #FFFFFF;border-radius:50%;box-shadow:0 0 0 5px rgba(37,99,235,0.28);"></div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });

    const userMarker = L.marker([userLat, userLng], {
      draggable: true,
      icon: userIcon
    }).addTo(map);
    userMarker.bindTooltip('Twoja lokalizacja (przeciągnij, aby zmienić)', {
      direction: 'top'
    });

    userMarker.on('dragend', (e) => {
      const pos = e.target.getLatLng();
      onUserMove(
        pos.lat,
        pos.lng,
        `Wybrana pozycja na mapie (${pos.lat.toFixed(5)}, ${pos.lng.toFixed(5)})`,
        true
      );
    });

    map.on('click', (e) => {
      onUserMove(
        e.latlng.lat,
        e.latlng.lng,
        `Wybrany punkt na mapie (${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)})`,
        true
      );
    });

    userMarkerRef.current = userMarker;
    setTimeout(() => map.invalidateSize(), 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Aktualizacja markerów, pozycji użytkownika i linii trasy
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    const userMarker = userMarkerRef.current;
    if (!map || !markersLayer || !userMarker) return;

    userMarker.setLatLng([userLat, userLng]);
    markersLayer.clearLayers();

    if (routeLineRef.current) {
      map.removeLayer(routeLineRef.current);
      routeLineRef.current = null;
    }

    pointsWithDist.forEach((pt) => {
      const isSelected = selectedAed && pt.id === selectedAed.id;
      const color = isSelected ? '#059669' : '#0284C7';
      const size = isSelected ? 28 : 20;

      const aedIcon = L.divIcon({
        className: '',
        html: `<div style="width:${size}px;height:${size}px;background:${color};color:#fff;font-weight:900;font-size:${
          isSelected ? 12 : 10
        }px;border:2.5px solid #fff;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.35);">AED</div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
      });

      const marker = L.marker([pt.lat, pt.lng], { icon: aedIcon }).addTo(markersLayer);
      marker.bindTooltip(`${pt.name} (${pt.dist} m)`, { direction: 'top' });
      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        onSelectAed(pt);
      });
    });

    if (selectedAed) {
      routeLineRef.current = L.polyline(
        [
          [userLat, userLng],
          [selectedAed.lat, selectedAed.lng]
        ],
        {
          color: '#D52B1E',
          weight: 5,
          opacity: 0.9,
          dashArray: '10, 8',
          className: 'route-dash'
        }
      ).addTo(map);

      const bounds = L.latLngBounds([
        [userLat, userLng],
        [selectedAed.lat, selectedAed.lng]
      ]);
      map.fitBounds(bounds, { padding: [55, 55], maxZoom: 17 });
    }
  }, [userLat, userLng, pointsWithDist, selectedAed]);

  const handleBasemapChange = (type) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    setBasemap(type);
    if (type === 'sat') {
      if (map.hasLayer(streetLayerRef.current)) map.removeLayer(streetLayerRef.current);
      satLayerRef.current.addTo(map);
    } else {
      if (map.hasLayer(satLayerRef.current)) map.removeLayer(satLayerRef.current);
      streetLayerRef.current.addTo(map);
    }
  };

  const handleCenterRoute = () => {
    const map = mapInstanceRef.current;
    if (!map || !selectedAed) return;
    const bounds = L.latLngBounds([
      [userLat, userLng],
      [selectedAed.lat, selectedAed.lng]
    ]);
    map.fitBounds(bounds, { padding: [55, 55], maxZoom: 17 });
  };

  return (
    <div className="lg:col-span-7 bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
          <h2 className="font-bold text-sm sm:text-base text-[#003366]">
            Mapa punktów AED i trasa dojścia
          </h2>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleBasemapChange('street')}
            className={`px-2.5 py-1 text-xs rounded cursor-pointer ${
              basemap === 'street'
                ? 'font-bold bg-[#003366] text-white'
                : 'font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Mapa ulic
          </button>
          <button
            onClick={() => handleBasemapChange('sat')}
            className={`px-2.5 py-1 text-xs rounded cursor-pointer ${
              basemap === 'sat'
                ? 'font-bold bg-[#003366] text-white'
                : 'font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Satelita
          </button>
          <button
            onClick={handleCenterRoute}
            className="px-2.5 py-1 text-xs font-bold rounded bg-white border border-[#003366] text-[#003366] hover:bg-blue-50 cursor-pointer"
          >
            Wyśrodkuj
          </button>
        </div>
      </div>

      <div ref={mapContainerRef} className="w-full" />

      <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-gray-700">
        <span className="inline-flex items-center gap-1.5 font-semibold">
          <span className="w-3 h-3 rounded-full bg-blue-600 inline-block border border-white shadow" />
          Twoja pozycja (przeciągnij lub kliknij mapę)
        </span>
        <span className="inline-flex items-center gap-1.5 font-semibold">
          <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block border border-white shadow" />
          Wybrany cel AED
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-sky-600 inline-block" />
          Inne AED w pobliżu
        </span>
      </div>
    </div>
  );
}
