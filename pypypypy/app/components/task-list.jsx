 'use client';

export function TaskList({ tasks, onToggle }) {
  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li
          key={task.id}
          className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer ${
            task.completed ? 'line-through text-gray-500' : ''
          }`}
          onClick={() => onToggle(task.id)}
        >
          <span>{task.title}</span>
        </li>
      ))}
    </ul>
  );
}