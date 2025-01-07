'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import KanbanBoard from './kanban-board';

const KanbanPage = () => {
  return (
    <div>
      <KanbanBoard />
    </div>
  );
};

export default KanbanPage;