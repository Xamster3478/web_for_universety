'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const initialData = [
  { date: '2023-06-01', steps: 8000, calories: 300, activity: 'Ходьба' },
  { date: '2023-06-02', steps: 10000, calories: 400, activity: 'Бег' },
  { date: '2023-06-03', steps: 5000, calories: 200, activity: 'Плавание' },
  { date: '2023-06-04', steps: 12000, calories: 500, activity: 'Ходьба' },
  { date: '2023-06-05', steps: 7000, calories: 350, activity: 'Велосипед' },
  { date: '2023-06-06', steps: 9000, calories: 380, activity: 'Ходьба' },
  { date: '2023-06-07', steps: 11000, calories: 450, activity: 'Бег' },
];

const activityTypes = ['Ходьба', 'Бег', 'Плавание', 'Велосипед', 'Другое'];

export default function ActivityPage() {
  const [data, setData] = useState(initialData);
  const [newDate, setNewDate] = useState('');
  const [newSteps, setNewSteps] = useState('');
  const [newCalories, setNewCalories] = useState('');
  const [newActivity, setNewActivity] = useState('');
  const [customActivity, setCustomActivity] = useState('');
  const [chartType, setChartType] = useState('steps');

  const handleAddData = (e) => {
    e.preventDefault();
    if (newDate && newSteps && newCalories && (newActivity || customActivity)) {
      const activityName = newActivity === 'Другое' ? customActivity : newActivity;
      const newEntry = {
        date: newDate,
        steps: parseInt(newSteps),
        calories: parseInt(newCalories),
        activity: activityName
      };
      setData([...data, newEntry]);
      setNewDate('');
      setNewSteps('');
      setNewCalories('');
      setNewActivity('');
      setCustomActivity('');
    }
  };

  return (
    <div className="space-y-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Активность</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип графика" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="steps">Шаги</SelectItem>
                <SelectItem value="calories">Сожженные калории</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="h-[300px] mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => format(new Date(value), 'dd.MM')}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => format(new Date(value), 'dd.MM.yyyy')}
                />
                <Area 
                  type="monotone" 
                  dataKey={chartType} 
                  stroke={chartType === 'steps' ? "#8884d8" : "#82ca9d"}
                  fill={chartType === 'steps' ? "#8884d8" : "#82ca9d"}
                />
              </AreaChart>
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
              type="number"
              value={newSteps}
              onChange={(e) => setNewSteps(e.target.value)}
              placeholder="Шаги"
              className="flex-grow"
            />
            <Input
              type="number"
              value={newCalories}
              onChange={(e) => setNewCalories(e.target.value)}
              placeholder="Сожженные калории"
              className="flex-grow"
            />
            <Select value={newActivity} onValueChange={setNewActivity}>
              <SelectTrigger className="flex-grow">
                <SelectValue placeholder="Тип активности" />
              </SelectTrigger>
              <SelectContent>
                {activityTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {newActivity === 'Другое' && (
              <Input
                type="text"
                value={customActivity}
                onChange={(e) => setCustomActivity(e.target.value)}
                placeholder="Введите тип активности"
                className="flex-grow"
              />
            )}
            <Button type="submit" className="w-full sm:w-auto">Добавить</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>История активности</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Дата</th>
                  <th className="px-4 py-2 text-left">Шаги</th>
                  <th className="px-4 py-2 text-left">Калории</th>
                  <th className="px-4 py-2 text-left">Тип активности</th>
                </tr>
              </thead>
              <tbody>
                {[...data].reverse().map((entry, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{format(new Date(entry.date), 'dd.MM.yyyy')}</td>
                    <td className="px-4 py-2">{entry.steps}</td>
                    <td className="px-4 py-2">{entry.calories} ккал</td>
                    <td className="px-4 py-2">{entry.activity}</td>
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

