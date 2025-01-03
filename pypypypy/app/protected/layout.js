'use client';

import React from 'react';
import { Navigation } from '../components/navigation';

const ProtectedLayout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Navigation />
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default ProtectedLayout;