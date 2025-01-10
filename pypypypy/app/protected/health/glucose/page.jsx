'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import LoadingSpinner from '@/components/loading-spinner';

export default function GlucosePage() {
  const [data, setData] = useState([]);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newGlucose, setNewGlucose] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Функция для получения токена из localStorage
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Функция для получения данных с сервера
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://backend-for-uni.onrender.com/api/health/glucose/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });
      const result = await response.json();
      setData(result.glucose);
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для добавления новых данных на сервер
  const addData = async (newEntry) => {
    try {
      const response = await fetch('https://backend-for-uni.onrender.com/api/health/glucose/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(newEntry),
      });
      if (response.ok) {
        fetchData(); // Обновляем данные после добавления
      }
    } catch (error) {
      console.error('Ошибка при добавлении данных:', error);
    }
  };

  // Функция для удаления данных с сервера
  const deleteData = async (glucoseId) => {
    try {
      const response = await fetch(`https://backend-for-uni.onrender.com/api/health/glucose/${glucoseId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });
      if (response.ok) {
        fetchData(); // Обновляем данные после удаления
      }
    } catch (error) {
      console.error('Ошибка при удалении данных:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddData = (e) => {
    e.preventDefault();
    if (newDate && newTime && newGlucose) {
      const newEntry = {
        date: `${newDate} ${newTime}`,
        glucose: parseFloat(newGlucose)
      };
      addData(newEntry);
      setNewDate('');
      setNewTime('');
      setNewGlucose('');
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Уровень глюкозы в крови</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => format(new Date(value), 'dd.MM HH:mm')}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => format(new Date(value), 'dd.MM.yyyy HH:mm')}
                />
                <Line type="monotone" dataKey="glucose" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <form onSubmit={handleAddData} className="flex flex-wrap gap-2">
            <Input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="flex-grow"
            />
            <Input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="flex-grow"
            />
            <Input
              type="number"
              value={newGlucose}
              onChange={(e) => setNewGlucose(e.target.value)}
              placeholder="Уровень глюкозы"
              className="flex-grow"
            />
            <Button type="submit" className="w-full sm:w-auto">Добавить</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>История измерений</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Дата и время</th>
                  <th className="px-4 py-2 text-left">Уровень глюкозы</th>
                  <th className="px-4 py-2 text-left">Действия</th>
                </tr>
              </thead>
              <tbody>
                {[...data].reverse().map((entry, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{format(new Date(entry.date), 'dd.MM.yyyy HH:mm')}</td>
                    <td className="px-4 py-2">{entry.glucose} ммоль/л</td>
                    <td className="px-4 py-2">
                      <button 
                        onClick={() => deleteData(entry.id)}
                        className="text-red-500 hover:text-red-700 hover:cursor-pointer hover:bg-red-100 rounded-full p-1 transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-md"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


