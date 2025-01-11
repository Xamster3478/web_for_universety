'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, CheckSquare, ChevronDown, Menu, X, Heart, Droplet, Utensils, Activity, Database, PenTool as Tool } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';
import Head from 'next/head';

const ProtectedLayout = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isTasksOpen, setIsTasksOpen] = useState(false);
  const [isHealthOpen, setIsHealthOpen] = useState(false);
  const [isUtilitiesOpen, setIsUtilitiesOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isDesktop = useMediaQuery({ minWidth: 768 });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch('https://backend-for-uni.onrender.com/api/verify-token/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Unauthorized');
        }

        const data = await response.json();
        setUser(data);
      } catch {
        router.push('/login');
      }
    };

    verifyToken();
  }, [router]);

  useEffect(() => {
    setIsNavOpen(isDesktop);
  }, [isDesktop]);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleTasksToggle = () => {
    if (!isDesktop) {
      setIsTasksOpen(!isTasksOpen);
    }
  };

  const handleTasksHover = (open) => {
    if (isDesktop) {
      setIsTasksOpen(open);
    }
  };

  const handleHealthToggle = () => {
    if (!isDesktop) {
      setIsHealthOpen(!isHealthOpen);
    }
  };

  const handleHealthHover = (open) => {
    if (isDesktop) {
      setIsHealthOpen(open);
    }
  };

  const handleUtilitiesToggle = () => {
    if (!isDesktop) {
      setIsUtilitiesOpen(!isUtilitiesOpen);
    }
  };

  const handleUtilitiesHover = (open) => {
    if (isDesktop) {
      setIsUtilitiesOpen(open);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Мой органайзер</title>
        <meta name="description" content="Ваш надежный помощник в управлении здоровьем и продуктивностью." />
      </Head>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        {isNavOpen && !isDesktop && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleNav}
          ></div>
        )}

        <aside 
          className={`
            fixed md:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
            ${isNavOpen ? 'translate-x-0' : '-translate-x-full'}
            ${isDesktop ? 'translate-x-0' : ''}
          `}
        >
          <div className="flex justify-between items-center p-4">
            <h1 className="text-2xl font-bold text-gray-800">Мой органайзер</h1>
            {!isDesktop && (
              <button onClick={toggleNav} className="md:hidden">
                <X size={24} />
              </button>
            )}
          </div>
          <nav className="mt-4">
            <Link href="/protected" className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 ${pathname === '/protected' ? 'bg-gray-200' : ''}`}>
              <Home className="mr-2" size={20} />
              Главная
            </Link>
            <div
              onMouseEnter={() => handleTasksHover(true)}
              onMouseLeave={() => handleTasksHover(false)}
            >
              <button
                onClick={handleTasksToggle}
                className="flex items-center justify-between w-full px-4 py-2 text-gray-700 hover:bg-gray-200"
              >
                <div className="flex items-center">
                  <CheckSquare className="mr-2" size={20} />
                  Задачи
                </div>
                <ChevronDown
                  size={20}
                  className={`transform transition-transform ${isTasksOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <div
                className={`ml-4 overflow-hidden transition-all duration-300 ease-in-out ${
                  isTasksOpen ? 'max-h-40' : 'max-h-0'
                }`}
              >
                <Link href="/protected/task-scheduler" className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 ${pathname === '/protected/task-scheduler' ? 'bg-gray-200' : ''}`}>
                  To-Do List
                </Link>
                <Link href="/protected/kanban" className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 ${pathname === '/protected/kanban' ? 'bg-gray-200' : ''}`}>
                  Kanban Доска
                </Link>
              </div>
            </div>
            <div
              onMouseEnter={() => handleHealthHover(true)}
              onMouseLeave={() => handleHealthHover(false)}
            >
              <button
                onClick={handleHealthToggle}
                className="flex items-center justify-between w-full px-4 py-2 text-gray-700 hover:bg-gray-200"
              >
                <div className="flex items-center">
                  <Heart className="mr-2" size={20} />
                  Здоровье
                </div>
                <ChevronDown
                  size={20}
                  className={`transform transition-transform ${isHealthOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <div
                className={`ml-4 overflow-hidden transition-all duration-300 ease-in-out ${
                  isHealthOpen ? 'max-h-40' : 'max-h-0'
                }`}
              >
                <Link href="/protected/health/glucose" className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 ${pathname === '/protected/health/glucose' ? 'bg-gray-200' : ''}`}>
                  <Droplet className="mr-2" size={16} />
                  Глюкоза
                </Link>
                <Link href="/protected/health/nutrition" className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 ${pathname === '/protected/health/nutrition' ? 'bg-gray-200' : ''}`}>
                  <Utensils className="mr-2" size={16} />
                  Питание
                </Link>
                <Link href="/protected/health/activity" className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 ${pathname === '/protected/health/activity' ? 'bg-gray-200' : ''}`}>
                  <Activity className="mr-2" size={16} />
                  Активность
                </Link>
              </div>
            </div>
            <div
              onMouseEnter={() => handleUtilitiesHover(true)}
              onMouseLeave={() => handleUtilitiesHover(false)}
            >
              <button
                onClick={handleUtilitiesToggle}
                className="flex items-center justify-between w-full px-4 py-2 text-gray-700 hover:bg-gray-200"
              >
                <div className="flex items-center">
                  <Tool className="mr-2" size={20} />
                  Утилиты
                </div>
                <ChevronDown
                  size={20}
                  className={`transform transition-transform ${isUtilitiesOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <div
                className={`ml-4 overflow-hidden transition-all duration-300 ease-in-out ${
                  isUtilitiesOpen ? 'max-h-40' : 'max-h-0'
                }`}
              >
                <Link href="/protected/storage" className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 ${pathname === '/protected/storage' ? 'bg-gray-200' : ''}`}>
                  <Database className="mr-2" size={16} />
                  Хранилище
                </Link>
              </div>
            </div>
          </nav>
        </aside>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                  {pathname === '/protected' ? 'Главная' : 
                   pathname === '/protected/task-scheduler' ? 'To-Do List' : 
                   pathname === '/protected/kanban' ? 'Kanban Доска' : 
                   pathname === '/protected/health/glucose' ? 'Глюкоза' :
                   pathname === '/protected/health/nutrition' ? 'Питание' :
                   pathname === '/protected/health/activity' ? 'Активность' :
                   pathname === '/protected/storage' ? 'Хранилище' : ''}
                </h2>
                {!isDesktop && (
                  <button onClick={toggleNav} className="md:hidden">
                    <Menu size={24} />
                  </button>
                )}
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default ProtectedLayout;