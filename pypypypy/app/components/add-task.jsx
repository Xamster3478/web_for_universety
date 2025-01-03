'use client';

import { useState } from 'react';

export function AddTask({ onAdd }) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim());
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <input
        type="text"
        placeholder="Добавить новую задачу"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-grow border p-2"
      />
      <button type="submit" className="p-2 bg-blue-500 text-white rounded">
        Добавить
      </button>
    </form>
  );
} 