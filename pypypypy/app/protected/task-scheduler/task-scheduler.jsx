'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';

async function createTask(description, completed) {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch('https://backend-for-uni.onrender.com/api/tasks/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ description, completed }),
    });

    if (!response.ok) {
      throw new Error('Ошибка при создании задачи');
    }

    const data = await response.json();
    console.log('Задача создана:', data);
    return data;
  } catch (error) {
    console.error('Ошибка:', error);
  }
}

async function getTasks() {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch('https://backend-for-uni.onrender.com/api/tasks/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Ошибка при получении задач');
    }

    const data = await response.json();
    console.log('Полученные задачи:', data.tasks);
    return data.tasks;
  } catch (error) {
    console.error('Ошибка:', error);
  }
}

async function deleteTask(taskId) {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`https://backend-for-uni.onrender.com/api/tasks/${taskId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Ошибка при удалении задачи');
    }

    const data = await response.json();
    console.log('Задача удалена:', data);
    return data;
  } catch (error) {
    console.error('Ошибка:', error);
  }
}

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim() !== '') {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Стильный To-Do List</h1>
      <form onSubmit={addTodo} className="mb-4 flex">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Добавить новую задачу..."
          className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 transition duration-200"
        >
          <Plus size={24} />
        </button>
      </form>
      <AnimatePresence>
        {todos.map(todo => (
          <motion.div
            key={todo.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between p-3 mb-2 bg-gray-100 rounded-md"
          >
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="form-checkbox h-5 w-5 text-blue-500 rounded focus:ring-blue-500"
              />
              <span className={`${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {todo.text}
              </span>
            </label>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-500 hover:text-red-700 transition duration-200"
            >
              <Trash2 size={20} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}