'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Login = () => {
    const [username, setUsername] = useState(''); // Хранит имя пользователя
    const [password, setPassword] = useState(''); // Хранит пароль
    const [isLoading, setIsLoading] = useState(false); // Состояние загрузки
    const [message, setMessage] = useState(''); // Сообщение для пользователя
    const router = useRouter(); // Хук для маршрутизации

    const handleSubmit = async (e) => {
        e.preventDefault(); // Предотвращаем стандартное поведение формы

        if (isLoading) return; // Предотвращаем повторные отправки

        // Проверка на заполнение полей
        if (!username || !password) {
            setMessage('Пожалуйста, введите имя пользователя и пароль.');
            return;
        }

        // Валидация пароля
        if (password.length < 6 || !/\d/.test(password)) {
            setMessage('Пароль должен быть не менее 6 символов и содержать хотя бы одну цифру.');
            return;
        }

        setIsLoading(true); // Устанавливаем состояние загрузки
        setMessage('Пожалуйста, подождите. Выполняется вход...'); // Показываем сообщение

        try {
            const response = await fetch('https://backend-for-uni.onrender.com/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }), // Отправляем данные на сервер
            });

            if (!response.ok) throw new Error('Ошибка при входе в систему'); // Обрабатываем ошибку

            const data = await response.json(); // Получаем данные ответа
            localStorage.setItem('token', data.access_token); // Сохраняем токен
            router.push('/protected/task-scheduler'); // Перенаправляем на защищенную страницу
        } catch (error) {
            console.error('Ошибка:', error);
            setMessage('Произошла ошибка при входе. Пожалуйста, попробуйте снова.'); // Показываем сообщение об ошибке
        } finally {
            setIsLoading(false); // Сбрасываем состояние загрузки
        }
    };

    const handleRegister = () => {
        router.push('/register'); // Перенаправляем на страницу регистрации
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Вход</h2>
                {message && (
                    <div className="mb-4 p-2 bg-blue-100 text-blue-700 rounded">
                        {message}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Имя пользователя:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isLoading} // Отключаем поле при загрузке
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Пароль:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isLoading} // Отключаем поле при загрузке
                        />
                    </div>
                    <button 
                        type="submit"
                        className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isLoading} // Отключаем кнопку при загрузке
                    >
                        {isLoading ? 'Выполняется вход...' : 'Войти'}
                    </button>
                    <button
                        type="button"
                        onClick={handleRegister}
                        className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        disabled={isLoading} // Отключаем кнопку при загрузке
                    >
                        Зарегистрироваться
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
