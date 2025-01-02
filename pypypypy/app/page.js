'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Home = () => {
    const router = useRouter();

    useEffect(() => {
        // Редирект на страницу логина
        router.push('/login');
    }, [router]);

    return null; // Поскольку мы сразу редиректим, возвращаем null
};

export default Home;