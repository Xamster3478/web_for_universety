'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import LoadingSpinner from '@/components/loading-spinner';

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
    return data;
  } catch (error) {
    console.error('Ошибка:', error);
    throw error;
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
    return data.tasks;
  } catch (error) {
    console.error('Ошибка:', error);
    throw error;
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
    return data;
  } catch (error) {
    console.error('Ошибка:', error);
    throw error;
  }
}

async function updateTask(taskId, description, completed) {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`https://backend-for-uni.onrender.com/api/tasks/${taskId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ description, completed }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Ошибка при обновлении задачи:', errorData);
      throw new Error('Ошибка при обновлении задачи');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка:', error);
    throw error;
  }
}

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const tasks = await getTasks();
        if (tasks) {
          setTodos(tasks.map(task => ({ id: task.id, text: task.description, completed: task.completed })));
        }
      } catch (error) {
        setError('Не удалось загрузить задачи. Пожалуйста, попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    setError('');
    if (newTodo.trim() === '') {
      setError('Поле задания не может быть пустым.');
      return;
    }

    setIsAdding(true);
    try {
      const newTask = await createTask(newTodo, false);
      if (newTask) {
        const tasks = await getTasks();
        if (tasks) {
          setTodos(tasks.map(task => ({ id: task.id, text: task.description, completed: task.completed })));
        }
        setNewTodo('');
      }
    } catch (err) {
      setError('Не удалось добавить задачу. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsAdding(false);
    }
  };

  const toggleTodo = async (id) => {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
      const updatedTask = await updateTask(id, todo.text, !todo.completed);
      if (updatedTask) {
        setTodos(todos.map(todo => 
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
      }
    }
  };

  const deleteTodo = async (id) => {
    try {
      const deletedTask = await deleteTask(id);
      if (deletedTask) {
        setTodos(todos.filter(todo => todo.id !== id));
      }
    } catch (err) {
      console.error('Не удалось удалить задачу:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Планируйте свой день!</h1>
      <form onSubmit={addTodo} className="mb-4 flex">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Добавить новую задачу..."
          className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isAdding || isLoading}
        />
        <button
          type="submit"
          className={`bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 transition duration-200 ${(isAdding || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isAdding || isLoading}
        >
          {isAdding ? 'Добавление...' : <Plus size={24} />}
        </button>
      </form>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
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
      )}
    </div>
  );
}

