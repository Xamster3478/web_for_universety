'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const ProtectedPage = () => {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        fetch('http://localhost:8000/verify-token', {
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
        return <p>Загрузка...</p>;
    }

    return (
        <div>
            <h1>Добро пожаловать, {user.username}!</h1>
            <p>Это защищенная страница.</p>
        </div>
    );
};

export default ProtectedPage;