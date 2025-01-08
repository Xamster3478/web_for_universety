'use client';

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, MoreVertical, Edit2 } from 'lucide-react';
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

export default function KanbanBoard() {
  const [columns, setColumns] = useState([
    { id: 'todo', title: 'To Do', tasks: [{ id: 'task1', content: 'Task 1' }] },
    { id: 'inprogress', title: 'In Progress', tasks: [] },
    { id: 'done', title: 'Done', tasks: [] },
  ]);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [newTaskContent, setNewTaskContent] = useState('');
  const [editingColumn, setEditingColumn] = useState(null);
  const [activeColumn, setActiveColumn] = useState(null);

  // Состояние для управления открытием диалога добавления колонки
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  // Состояние для управления открытием диалога добавления задачи
  const [activeTaskColumn, setActiveTaskColumn] = useState(null);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      const column = columns.find(col => col.id === source.droppableId);
      if (column) {
        const newTasks = Array.from(column.tasks);
        const [reorderedItem] = newTasks.splice(source.index, 1);
        newTasks.splice(destination.index, 0, reorderedItem);

        const newColumns = columns.map(col =>
          col.id === source.droppableId ? { ...col, tasks: newTasks } : col
        );
        setColumns(newColumns);
      }
    } else {
      const sourceColumn = columns.find(col => col.id === source.droppableId);
      const destColumn = columns.find(col => col.id === destination.droppableId);
      if (sourceColumn && destColumn) {
        const sourceTasks = Array.from(sourceColumn.tasks);
        const destTasks = Array.from(destColumn.tasks);
        const [movedItem] = sourceTasks.splice(source.index, 1);
        destTasks.splice(destination.index, 0, movedItem);

        const newColumns = columns.map(col => {
          if (col.id === source.droppableId) {
            return { ...col, tasks: sourceTasks };
          }
          if (col.id === destination.droppableId) {
            return { ...col, tasks: destTasks };
          }
          return col;
        });
        setColumns(newColumns);
      }
    }
  };

  const addTask = () => {
    if (newTaskContent.trim() !== '' && activeTaskColumn) {
      const newTask = {
        id: `task-${Date.now()}`,
        content: newTaskContent,
      };
      const newColumns = columns.map(col =>
        col.id === activeTaskColumn ? { ...col, tasks: [...col.tasks, newTask] } : col
      );
      setColumns(newColumns);
      setNewTaskContent('');
      // Закрываем диалог после добавления задачи
      setActiveTaskColumn(null);
    }
  };

  const addColumn = () => {
    if (newColumnTitle.trim() !== '') {
      const newColumn = {
        id: `column-${Date.now()}`,
        title: newColumnTitle,
        tasks: [],
      };
      setColumns([...columns, newColumn]);
      setNewColumnTitle('');
      // Закрываем диалог после добавления колонки
      setIsAddColumnOpen(false);
    }
  };

  const startEditingColumn = (columnId) => {
    setEditingColumn(columnId);
  };

  const finishEditingColumn = (columnId, newTitle) => {
    if (newTitle.trim() !== '') {
      const newColumns = columns.map(col =>
        col.id === columnId ? { ...col, title: newTitle } : col
      );
      setColumns(newColumns);
    }
    setEditingColumn(null);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-300">
          <h1 className="text-3xl font-bold text-gray-800">Отслеживайте ваши достижения!!!</h1>
          <Dialog open={isAddColumnOpen} onOpenChange={setIsAddColumnOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600" onClick={() => setIsAddColumnOpen(true)}>
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
                <Button onClick={addColumn} className="bg-blue-500 text-white hover:bg-blue-600">Добавить колонку</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 overflow-x-auto pb-4">
            {columns.map(column => (
              <div key={column.id} className="bg-white p-4 rounded-lg shadow-md w-full md:w-80 flex-shrink-0">
                <div className="mb-4 pb-2 border-b border-gray-200">
                  {editingColumn === column.id ? (
                    <input
                      type="text"
                      value={column.title}
                      onChange={(e) => {
                        const newColumns = columns.map(col =>
                          col.id === column.id ? { ...col, title: e.target.value } : col
                        );
                        setColumns(newColumns);
                      }}
                      onBlur={() => finishEditingColumn(column.id, column.title)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          finishEditingColumn(column.id, column.title);
                        }
                      }}
                      className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                  ) : (
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-semibold text-gray-700">{column.title}</h2>
                      <button
                        onClick={() => startEditingColumn(column.id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Edit2 size={16} />
                      </button>
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
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-gray-50 p-3 mb-2 rounded shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200"
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-gray-700">{task.content}</span>
                                <MoreVertical size={16} className="text-gray-400" />
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
                      <Button onClick={addTask} className="bg-green-500 text-white hover:bg-green-600">Добавить задачу</Button>
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