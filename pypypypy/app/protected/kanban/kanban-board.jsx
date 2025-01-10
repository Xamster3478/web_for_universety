'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LoadingSpinner from '@/components/loading-spinner';

// Центральная функция для выполнения API запросов
const apiFetch = async (url, method = 'GET', body = null) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(`https://backend-for-uni.onrender.com${url}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Ошибка при выполнении запроса');
    }

    return await response.json();
  } catch (error) {
    console.error('Ошибка при API запросе:', error);
    throw error;
  }
};

export default function KanbanBoard() {
  const [columns, setColumns] = useState({});
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [newTaskContent, setNewTaskContent] = useState('');
  const [editingColumn, setEditingColumn] = useState(null);
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [activeTaskColumn, setActiveTaskColumn] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchColumnsAndTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiFetch('/api/kanban/', 'GET');
      const fetchedColumns = {};
      for (const col of data.columns) {
        fetchedColumns[col.id] = { id: col.id, title: col.name, tasks: [] };
        const tasksData = await apiFetch(`/api/kanban/${col.id}/tasks/`, 'GET');
        fetchedColumns[col.id].tasks = tasksData.tasks.map(task => ({ id: task.id, content: task.description }));
      }
      setColumns(fetchedColumns);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchColumnsAndTasks();
  }, [fetchColumnsAndTasks]);

  const finishEditingColumn = async (columnId, newTitle, taskId, newDescription, newColumnId) => {
    if (newDescription.trim() === '') return;

    try {
      await apiFetch(`/api/kanban/${columnId}/tasks/${taskId}/`, 'PATCH', { 
        column_id: newColumnId,
        description: newDescription
      });
      
      setColumns(prev => {
        const updatedColumns = { ...prev };

        if (columnId !== newColumnId) {
          const taskIndex = updatedColumns[columnId].tasks.findIndex(task => task.id === taskId);
          const [movedTask] = updatedColumns[columnId].tasks.splice(taskIndex, 1);

          movedTask.description = newDescription;
          movedTask.column_id = newColumnId;

          updatedColumns[newColumnId].tasks.push(movedTask);
        } else {
          const task = updatedColumns[columnId].tasks.find(task => task.id === taskId);
          if (task) {
            task.description = newDescription;
          }
        }

        return updatedColumns;
      });

      setEditingColumn(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const addTask = async () => {
    if (newTaskContent.trim() === '' || !activeTaskColumn) return;

    try {
      const data = await apiFetch(`/api/kanban/${activeTaskColumn}/tasks/`, 'POST', { 
        column_id: activeTaskColumn,
        description: newTaskContent
      });

      const newTask = { id: data.task_id, content: newTaskContent };
      setColumns(prev => ({
        ...prev,
        [activeTaskColumn]: {
          ...prev[activeTaskColumn],
          tasks: [...prev[activeTaskColumn].tasks, newTask],
        },
      }));
      setNewTaskContent('');
      setActiveTaskColumn(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const addColumn = async () => {
    if (newColumnTitle.trim() === '') return;

    try {
      const data = await apiFetch('/api/kanban/', 'POST', { name: newColumnTitle });
      const newColumn = { id: data.column_id, title: newColumnTitle, tasks: [] };
      setColumns(prev => ({
        ...prev,
        [data.column_id]: newColumn,
      }));
      setNewColumnTitle('');
      setIsAddColumnOpen(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const deleteTask = async (columnId, taskId) => {
    try {
      await apiFetch(`/api/kanban/${columnId}/tasks/${taskId}/`, 'DELETE');
      setColumns(prev => ({
        ...prev,
        [columnId]: {
          ...prev[columnId],
          tasks: prev[columnId].tasks.filter(task => task.id !== taskId),
        },
      }));
    } catch (error) {
      setError(error.message);
    }
  };

  const deleteColumn = async (columnId) => {
    try {
      // Получаем все задачи в колонке
      const tasks = columns[columnId].tasks;

      // Удаляем каждую задачу в колонке
      for (const task of tasks) {
        await apiFetch(`/api/kanban/${columnId}/tasks/${task.id}/`, 'DELETE');
      }

      // Удаляем саму колонку
      await apiFetch(`/api/kanban/${columnId}/`, 'DELETE');

      // Обновляем состояние колонок на клиенте
      setColumns(prev => {
        const newColumns = { ...prev };
        delete newColumns[columnId];
        return newColumns;
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const onDragEnd = useCallback(async (result) => {
    setIsDragging(false);
    const { source, destination } = result;

    if (!destination) return;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    
    if (!sourceColumn || !destColumn) return;

    const sourceTasks = Array.from(sourceColumn.tasks);
    const destTasks = Array.from(destColumn.tasks);
    let updatedColumns = { ...columns };

    if (source.droppableId === destination.droppableId) {
      const [movedTask] = sourceTasks.splice(source.index, 1);
      sourceTasks.splice(destination.index, 0, movedTask);
      updatedColumns[source.droppableId] = {
        ...sourceColumn,
        tasks: sourceTasks
      };
    } else {
      const [movedTask] = sourceTasks.splice(source.index, 1);
      destTasks.splice(destination.index, 0, movedTask);
      updatedColumns[source.droppableId] = {
        ...sourceColumn,
        tasks: sourceTasks
      };
      updatedColumns[destination.droppableId] = {
        ...destColumn,
        tasks: destTasks
      };
    }

    setColumns(updatedColumns);

    try {
      for (const columnId of Object.keys(updatedColumns)) {
        for (const task of updatedColumns[columnId].tasks) {
          await apiFetch(`/api/kanban/${columnId}/tasks/${task.id}/`, 'PATCH', { 
            column_id: columnId,
            description: task.content
          });
        }
      }
    } catch (err) {
      console.error('Ошибка при обновлении позиций задач:', err);
    }
  }, [columns]);

  const onDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {error && <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">{error}</div>}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-300">
          <h1 className="text-3xl font-bold text-gray-800">Отслеживайте ваши достижения!!!</h1>
          <Dialog open={isAddColumnOpen} onOpenChange={setIsAddColumnOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">
                <Plus className="mr-2 h-4 w-4" /> Добавить колонку
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Добавить новую колонку</DialogTitle>
                <DialogDescription>
                  Введите название для новой колонки.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Название
                  </Label>
                  <Input
                    id="name"
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={addColumn} className="bg-blue-500 text-white hover:bg-blue-600">
                  Добавить колонку
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 overflow-x-auto pb-4">
            {Object.values(columns).map((column) => (
              <div key={column.id} className="bg-white p-4 rounded-lg shadow-md w-full md:w-80 flex-shrink-0">
                <div className="mb-4 pb-2 border-b border-gray-200">
                  {editingColumn === column.id ? (
                    <Input
                      type="text"
                      value={column.title}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        setColumns(prev => ({
                          ...prev,
                          [column.id]: { ...prev[column.id], title: newTitle },
                        }));
                      }}
                      onBlur={() => finishEditingColumn(column.id, column.title, column.tasks[0]?.id, column.tasks[0]?.description, column.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          finishEditingColumn(column.id, column.title, column.tasks[0]?.id, column.tasks[0]?.description, column.id);
                        }
                      }}
                      className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                  ) : (
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-semibold text-gray-700">{column.title}</h2>
                      <div className="flex items-center">
                        <button
                          onClick={() => setEditingColumn(column.id)}
                          className="text-gray-500 hover:text-gray-700 mr-2 hover:cursor-pointer hover:bg-gray-100 rounded-full p-1 transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-md"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                        onClick={() => deleteColumn(column.id)}
                        className="text-red-500 hover:text-red-700 hover:cursor-pointer hover:bg-red-100 rounded-full p-1 transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-md"
                      >
                          <Trash2 size={16} />
                      </button>
                      </div>
                    </div>
                  )}
                </div>
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="min-h-[200px]"
                    >
                      {column.tasks.map((task, index) => (
                        <Draggable 
                          key={task.id} 
                          draggableId={task.id.toString()} 
                          index={index}
                          isDragDisabled={isDragging}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-gray-50 p-3 mb-2 rounded shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200"
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-gray-700">{task.content}</span>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <button className="text-gray-400 hover:text-gray-600">
                                      <MoreVertical size={16} />
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => deleteTask(column.id, task.id)}>
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      <span>Удалить</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <Dialog open={activeTaskColumn === column.id} onOpenChange={(open) => open ? setActiveTaskColumn(column.id) : setActiveTaskColumn(null)}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="mt-2 w-full bg-green-500 text-white hover:bg-green-600"
                      onClick={() => setActiveTaskColumn(column.id)}
                    >
                      <Plus size={16} className="mr-1" /> Добавить задачу
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Добавить новую задачу</DialogTitle>
                      <DialogDescription>
                        Введите описание новой задачи для колонки "{column.title}".
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="task" className="text-right">
                          Задача
                        </Label>
                        <Input
                          id="task"
                          value={newTaskContent}
                          onChange={(e) => setNewTaskContent(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={addTask} className="bg-green-500 text-white hover:bg-green-600">
                        Добавить задачу
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}