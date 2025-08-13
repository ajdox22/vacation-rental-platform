'use client';

import { Suspense } from 'react';
import ListingsPageContent from './ListingsPageContent';

export default function ListingsPage() {
  return (
    <Suspense fallback={<div className="p-6">Učitavanje oglasa...</div>}>
      <ListingsPageContent />
    </Suspense>
  );
}
