'use client';

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Modal from 'react-modal';

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
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newColumnName, setNewColumnName] = useState('');

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
      });
    } else {
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    }
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleAddTask = (columnId) => {
    if (newTaskTitle.trim()) {
      setColumns({
        ...columns,
        [columnId]: {
          ...columns[columnId],
          items: [
            ...columns[columnId].items,
            { id: Date.now().toString(), title: newTaskTitle },
          ],
        },
      });
      setNewTaskTitle('');
      closeModal();
    }
  };

  const handleAddColumn = () => {
    if (newColumnName.trim()) {
      const columnId = Date.now().toString();
      setColumns({
        ...columns,
        [columnId]: {
          name: newColumnName,
          items: [],
        },
      });
      setNewColumnName('');
    }
  };

  return (
    <div>
      <button onClick={openModal} className="p-2 bg-blue-500 text-white rounded fixed top-4 left-4">
        Добавить задачу
      </button>
      <input
        type="text"
        value={newColumnName}
        onChange={(e) => setNewColumnName(e.target.value)}
        placeholder="Название новой колонки"
        className="border p-2 mb-4"
      />
      <button onClick={handleAddColumn} className="p-2 bg-green-500 text-white rounded ml-2">
        Добавить колонку
      </button>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4 mt-4">
          {Object.entries(columns).map(([columnId, column]) => (
            <Droppable key={columnId} droppableId={columnId}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-gray-100 p-4 rounded w-1/3"
                >
                  <h2 className="text-xl font-bold mb-4">{column.name}</h2>
                  {column.items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-2 mb-2 rounded shadow"
                        >
                          {item.title}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Добавить задачу"
        className="bg-white p-6 rounded shadow-md max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-xl font-bold mb-4">Добавить новую задачу</h2>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="border p-2 w-full mb-4"
          placeholder="Название задачи"
        />
        <button onClick={() => handleAddTask('todo')} className="p-2 bg-blue-500 text-white rounded">
          Добавить
        </button>
        <button onClick={closeModal} className="p-2 bg-gray-300 text-black rounded ml-2">
          Отмена
        </button>
      </Modal>
    </div>
  );
};

export default KanbanBoard;