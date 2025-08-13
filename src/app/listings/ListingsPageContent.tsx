'use client';

import { useSearchParams } from 'next/navigation';

export default function ListingsPageContent() {
  const params = useSearchParams();

  // Primjer čitanja parametara (prilagodi kasnije po potrebi)
  const q = params.get('q') || '';
  const city = params.get('city') || '';
  const guests = params.get('guests') || '';

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold">Oglasi</h1>
      <p className="text-sm text-gray-500 mt-1">
        Pretraga: q={q || '-'}, city={city || '-'}, guests={guests || '-'}
      </p>
      {/* TODO: ovdje ide tvoja realna lista oglasa i filteri */}
    </div>
  );
}
