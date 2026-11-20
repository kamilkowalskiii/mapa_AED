import React, { useMemo, useState } from 'react';
import Header from './components/Header';
import LocationBar from './components/LocationBar';
import AedMap from './components/AedMap';
import TargetAedCard from './components/TargetAedCard';
import CprAssistant from './components/CprAssistant';
import OpenDataPortal from './components/OpenDataPortal';
import Footer from './components/Footer';
import { AED_POINTS, CITY_PRESETS, haversineMeters } from './data/aedPoints';

export default function App() {
  const [activeTab, setActiveTab] = useState('rescue');
  const [userLat, setUserLat] = useState(CITY_PRESETS.warszawa.lat);
  const [userLng, setUserLng] = useState(CITY_PRESETS.warszawa.lng);
  const [locationLabel, setLocationLabel] = useState(CITY_PRESETS.warszawa.label);
  const [selectedAedId, setSelectedAedId] = useState(1);
  const [actionBoxOpen, setActionBoxOpen] = useState(false);

  const pointsWithDist = useMemo(() => {
    return AED_POINTS.map((pt) => ({
      ...pt,
      dist: haversineMeters(userLat, userLng, pt.lat, pt.lng)
    })).sort((a, b) => a.dist - b.dist);
  }, [userLat, userLng]);

  const selectedAed = useMemo(() => {
    return pointsWithDist.find((p) => p.id === selectedAedId) || pointsWithDist[0];
  }, [pointsWithDist, selectedAedId]);

  const handleUpdatePosition = (lat, lng, label, autoSelectNearest) => {
    setUserLat(lat);
    setUserLng(lng);
    setLocationLabel(label);

    if (autoSelectNearest) {
      const sorted = AED_POINTS.map((pt) => ({
        ...pt,
        dist: haversineMeters(lat, lng, pt.lat, pt.lng)
      })).sort((a, b) => a.dist - b.dist);
      if (sorted.length > 0) {
        setSelectedAedId(sorted[0].id);
      }
    }
  };

  const handleSelectAedFromMap = (pt) => {
    setSelectedAedId(pt.id);
    setActionBoxOpen(true);
  };

  const handleFocusAedFromTable = (pt) => {
    setSelectedAedId(pt.id);
    setUserLat(pt.lat - 0.0005);
    setUserLng(pt.lng - 0.0005);
    setLocationLabel(`Okolica: ${pt.name}`);
    setActiveTab('rescue');
    setActionBoxOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {activeTab === 'rescue' ? (
          <div className="space-y-4 sm:space-y-6">
            <LocationBar
              locationLabel={locationLabel}
              onUpdatePosition={handleUpdatePosition}
            />

            <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
              <AedMap
                userLat={userLat}
                userLng={userLng}
                pointsWithDist={pointsWithDist}
                selectedAed={selectedAed}
                onSelectAed={handleSelectAedFromMap}
                onUserMove={handleUpdatePosition}
              />

              <TargetAedCard
                userLat={userLat}
                userLng={userLng}
                selectedAed={selectedAed}
                actionBoxOpen={actionBoxOpen}
                setActionBoxOpen={setActionBoxOpen}
              />
            </section>

            <CprAssistant />
          </div>
        ) : (
          <OpenDataPortal onFocusAed={handleFocusAedFromTable} />
        )}
      </main>

      <Footer />
    </div>
  );
}
