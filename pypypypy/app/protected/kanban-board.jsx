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
  const [addType, setAddType] = useState('task'); // New state to track what to add

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
      closeModal();
    }
  };

  const handleAdd = () => {
    if (addType === 'task') {
      handleAddTask('todo');
    } else if (addType === 'column') {
      handleAddColumn();
    }
  };

  return (
    <div>
      <button onClick={openModal} className="p-2 bg-blue-500 text-white rounded fixed top-4 right-4">
        Добавить
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
        contentLabel="Добавить элемент"
        className="bg-white p-6 rounded shadow-md max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-xl font-bold mb-4">Добавить новый элемент</h2>
        <div className="mb-4">
          <label className="mr-2">
            <input
              type="radio"
              value="task"
              checked={addType === 'task'}
              onChange={() => setAddType('task')}
            />
            Задача
          </label>
          <label className="ml-4">
            <input
              type="radio"
              value="column"
              checked={addType === 'column'}
              onChange={() => setAddType('column')}
            />
            Колонка
          </label>
        </div>
        {addType === 'task' && (
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="border p-2 w-full mb-4"
            placeholder="Название задачи"
          />
        )}
        {addType === 'column' && (
          <input
            type="text"
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            className="border p-2 w-full mb-4"
            placeholder="Название новой колонки"
          />
        )}
        <button onClick={handleAdd} className="p-2 bg-blue-500 text-white rounded">
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