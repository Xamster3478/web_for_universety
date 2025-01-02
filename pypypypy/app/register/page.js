'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const router = useRouter();

    const handleSubmit = async(e) => {
        e.preventDefault();

        // Простая валидация
        if (!username || !password || !email) {
            alert('Пожалуйста, заполните все поля.');
            return;
        }

        // Валидация пароля
        if (password.length < 6 || !/\d/.test(password)) {
            alert('Пароль должен быть не менее 6 символов и содержать хотя бы одну цифру.');
            return;
        }

        try {
            const response = await fetch('https://backend-for-uni.onrender.com/create-user/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, email }),
            });

            if (!response.ok) {
                throw new Error('Ошибка при создании пользователя');
            }

            const data = await response.json();
            console.log('Регистрация успешна:', data);
            router.push('/login');
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    const handleLogin = () => {
        router.push('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Регистрация</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Имя пользователя:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Пароль:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button 
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Зарегистрироваться
                    </button>
                    <button
                        type="button"
                        onClick={handleLogin}
                        className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                        Войти
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;