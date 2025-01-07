'use client';

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, MoreVertical } from 'lucide-react';

export default function KanbanBoard() {
  const [columns, setColumns] = useState([
    { id: 'todo', title: 'To Do', tasks: [{ id: 'task1', content: 'Task 1' }] },
    { id: 'inprogress', title: 'In Progress', tasks: [] },
    { id: 'done', title: 'Done', tasks: [] },
  ]);

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

  const addTask = (columnId) => {
    const newTask = {
      id: `task-${Date.now()}`,
      content: `New Task ${Date.now()}`,
    };
    const newColumns = columns.map(col =>
      col.id === columnId ? { ...col, tasks: [...col.tasks, newTask] } : col
    );
    setColumns(newColumns);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Стильная Kanban Доска</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4">
          {columns.map(column => (
            <div key={column.id} className="bg-gray-200 p-4 rounded-lg w-80">
              <h2 className="text-lg font-semibold mb-4">{column.title}</h2>
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
                            className="bg-white p-3 mb-2 rounded shadow-sm hover:shadow-md transition-shadow duration-200"
                          >
                            <div className="flex justify-between items-center">
                              <span>{task.content}</span>
                              <MoreVertical size={16} className="text-gray-500" />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <button
                onClick={() => addTask(column.id)}
                className="mt-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200 flex items-center justify-center"
              >
                <Plus size={16} className="mr-1" /> Add Task
              </button>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}