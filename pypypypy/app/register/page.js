'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Определение схемы валидации
const schema = z.object({
  username: z.string().min(3, { message: 'Имя пользователя должно содержать минимум 3 символа' }),
  password: z.string()
    .min(6, { message: 'Пароль должен содержать минимум 6 символов' })
    .regex(/\d/, { message: 'Пароль должен содержать хотя бы одну цифру' }),
});

const Register = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        setServerError('');

        try {
            const response = await fetch('https://backend-for-uni.onrender.com/api/create-user/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка при создании пользователя');
            }

            const responseData = await response.json();
            console.log('Регистрация успешна:', responseData);
            router.push('/login');
        } catch (error) {
            console.error('Ошибка:', error);
            setServerError(error instanceof Error ? error.message : 'Произошла неизвестная ошибка');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = () => {
        router.push('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Регистрация</h2>
                {serverError && (
                    <div className="mb-4 p-2 bg-red-100 text-red-700 rounded" role="alert">
                        {serverError}
                    </div>
                )}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Имя пользователя:</label>
                        <input
                            id="username"
                            type="text"
                            {...register('username')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isLoading}
                        />
                        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Пароль:</label>
                        <input
                            id="password"
                            type="password"
                            {...register('password')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isLoading}
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>
                    <button 
                        type="submit"
                        className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>
                    <button
                        type="button"
                        onClick={handleLogin}
                        className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        disabled={isLoading}
                    >
                        Войти
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;