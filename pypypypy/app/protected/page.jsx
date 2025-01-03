'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TaskScheduler from './task-scheduler';

const ProtectedPage = () => {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        fetch('https://backend-for-uni.onrender.com/api/verify-token/', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Unauthorized');
                }
                return response.json();
            })
            .then(data => setUser(data))
            .catch(() => router.push('/login'));
    }, [router]);

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div>
            <h1>Добро пожаловать, {user.username}!</h1>
            <p>Это защищенная страница.</p>
            <TaskScheduler />
        </div>
    );
};

export default ProtectedPage;