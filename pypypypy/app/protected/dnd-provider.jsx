'use client';

import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

export function DnDProvider({ children }) {
  return <DndProvider backend={HTML5Backend}>{children}</DndProvider>;
} 