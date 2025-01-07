'use client';

import { useState } from 'react';
import { AddTask } from '../../components/add-task';
import { TaskList } from '../../components/task-list';

const TaskScheduler = () => {
  const [tasks, setTasks] = useState([]);

  const handleAddTask = (title) => {
    setTasks([...tasks, { id: Date.now().toString(), title, completed: false }]);
  };

  const handleToggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Планировщик задач</h2>
      <AddTask onAdd={handleAddTask} />
      <div className="mt-6">
        <TaskList tasks={tasks} onToggle={handleToggleTask} />
      </div>
    </div>
  );
};

export default TaskScheduler; 