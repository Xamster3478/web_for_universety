'use client';

import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { DnDProvider } from './dnd-provider';

const ItemTypes = {
  TASK: 'task',
};

const initialColumns = {
  todo: {
    name: 'To Do',
    items: [],
  },
  inProgress: {
    name: 'In Progress',
    items: [],
  },
  done: {
    name: 'Done',
    items: [],
  },
};

const KanbanBoard = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const moveTask = (source, destination) => {
    const sourceItems = [...columns[source.droppableId].items];
    const destItems = [...columns[destination.droppableId].items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);

    setColumns({
      ...columns,
      [source.droppableId]: {
        ...columns[source.droppableId],
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...columns[destination.droppableId],
        items: destItems,
      },
    });
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      setColumns({
        ...columns,
        todo: {
          ...columns.todo,
          items: [
            ...columns.todo.items,
            { id: Date.now().toString(), title: newTaskTitle },
          ],
        },
      });
      setNewTaskTitle('');
    }
  };

  return (
    <DnDProvider>
      <div>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Название задачи"
          className="border p-2"
        />
        <button onClick={handleAddTask} className="p-2 bg-blue-500 text-white rounded">
          Добавить задачу
        </button>
        <div className="flex space-x-4 mt-4">
          {Object.entries(columns).map(([columnId, column]) => (
            <Column
              key={columnId}
              columnId={columnId}
              column={column}
              moveTask={moveTask}
            />
          ))}
        </div>
      </div>
    </DnDProvider>
  );
};

const Column = ({ columnId, column, moveTask }) => {
  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop: (item, monitor) => {
      const source = monitor.getItem();
      const destination = { droppableId: columnId, index: column.items.length };
      moveTask(source, destination);
    },
  });

  return (
    <div ref={drop} className="bg-gray-100 p-4 rounded w-1/3">
      <h2 className="text-xl font-bold mb-4">{column.name}</h2>
      {column.items.map((item, index) => (
        <Task key={item.id} item={item} index={index} columnId={columnId} />
      ))}
    </div>
  );
};

const Task = ({ item, index, columnId }) => {
  const [, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { ...item, index, columnId },
  });

  return (
    <div ref={drag} className="bg-white p-2 mb-2 rounded shadow">
      {item.title}
    </div>
  );
};

export default KanbanBoard; 