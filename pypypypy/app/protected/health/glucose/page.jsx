'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const initialData = [
  { date: '2023-06-01 08:00', glucose: 95 },
  { date: '2023-06-01 12:00', glucose: 110 },
  { date: '2023-06-01 18:00', glucose: 98 },
  { date: '2023-06-02 08:00', glucose: 92 },
  { date: '2023-06-02 12:00', glucose: 105 },
  { date: '2023-06-02 18:00', glucose: 100 },
];

export default function GlucosePage() {
  const [data, setData] = useState(initialData);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newGlucose, setNewGlucose] = useState('');

  const handleAddData = (e) => {
    e.preventDefault();
    if (newDate && newTime && newGlucose) {
      const newEntry = {
        date: `${newDate} ${newTime}`,
        glucose: parseFloat(newGlucose)
      };
      setData([...data, newEntry]);
      setNewDate('');
      setNewTime('');
      setNewGlucose('');
    }
  };

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
                </tr>
              </thead>
              <tbody>
                {[...data].reverse().map((entry, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{format(new Date(entry.date), 'dd.MM.yyyy HH:mm')}</td>
                    <td className="px-4 py-2">{entry.glucose} мг/дл</td>
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

