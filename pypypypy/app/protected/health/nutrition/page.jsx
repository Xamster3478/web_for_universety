'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const initialData = [
  { date: '2023-06-01', calories: 2200, water: 2.0 },
  { date: '2023-06-02', calories: 2100, water: 1.8 },
  { date: '2023-06-03', calories: 2300, water: 2.2 },
  { date: '2023-06-04', calories: 2000, water: 1.9 },
  { date: '2023-06-05', calories: 2400, water: 2.1 },
  { date: '2023-06-06', calories: 2600, water: 2.5 },
  { date: '2023-06-07', calories: 2500, water: 2.3 },
];

export default function NutritionPage() {
  const [data, setData] = useState(initialData);
  const [newDate, setNewDate] = useState('');
  const [newCalories, setNewCalories] = useState('');
  const [newWater, setNewWater] = useState('');
  const [chartType, setChartType] = useState('calories');

  const handleAddData = (e) => {
    e.preventDefault();
    if (newDate && newCalories && newWater) {
      const newEntry = {
        date: newDate,
        calories: parseInt(newCalories),
        water: parseFloat(newWater)
      };
      setData([...data, newEntry]);
      setNewDate('');
      setNewCalories('');
      setNewWater('');
    }
  };

  return (
    <div className="space-y-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Питание и водный баланс</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип графика" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="calories">Калории</SelectItem>
                <SelectItem value="water">Вода</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="h-[300px] mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => format(new Date(value), 'dd.MM')}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => format(new Date(value), 'dd.MM.yyyy')}
                />
                <Bar 
                  dataKey={chartType} 
                  fill={chartType === 'calories' ? "#8884d8" : "#82ca9d"}
                />
              </BarChart>
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
              value={newCalories}
              onChange={(e) => setNewCalories(e.target.value)}
              placeholder="Калории"
              className="flex-grow"
            />
            <Input
              type="number"
              value={newWater}
              onChange={(e) => setNewWater(e.target.value)}
              placeholder="Вода (л)"
              step="0.1"
              className="flex-grow"
            />
            <Button type="submit" className="w-full sm:w-auto">Добавить</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>История питания</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Дата</th>
                  <th className="px-4 py-2 text-left">Калории</th>
                  <th className="px-4 py-2 text-left">Вода (л)</th>
                </tr>
              </thead>
              <tbody>
                {[...data].reverse().map((entry, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{format(new Date(entry.date), 'dd.MM.yyyy')}</td>
                    <td className="px-4 py-2">{entry.calories} ккал</td>
                    <td className="px-4 py-2">{entry.water} л</td>
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

