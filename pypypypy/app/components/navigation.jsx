'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const links = [
  { name: 'Задачи', href: '/protected/task-scheduler' },
  // Добавьте другие ссылки здесь
];

export function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`fixed top-0 left-0 h-full transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <nav className="flex flex-col h-full justify-between p-4 bg-background border-r">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-primary mb-6">Планировщик</h1>
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center space-x-2 text-muted-foreground hover:text-primary ${
                pathname === link.href ? 'text-primary font-medium' : ''
              }`}
            >
              <span>{link.name}</span>
            </Link>
          ))}
        </div>
        <div className="flex space-x-2">
          <button className="p-2 bg-blue-500 text-white rounded">Назад</button>
          <button className="p-2 bg-blue-500 text-white rounded">Вперед</button>
        </div>
      </nav>
    </div>
  );
}