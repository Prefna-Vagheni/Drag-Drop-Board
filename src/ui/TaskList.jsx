import { useContext } from 'react';
import { TaskContext } from '../context/TasksContext';
// import Task from ' ./Task';

function TaskList() {
  const { tasks, setTasks } = useContext(TaskContext);

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };
  return (
    <div className=" space-y-2">
      {tasks.length === 0 && <p>No tasks yet</p>}
      {/* {tasks.map((task) => (
        <Task key={task.id}>
          <span
            onClick={() => toggleTask(task.id)}
            className={`cursor-pointer ${
              task.completed ? 'line-through text-gray-500' : ''
            }`}
          >
            {task.text}
          </span>
          <button
            onClick={() => deleteTask(task.id)}
            className="text-red-500 hover:text-red-700 cursor-pointer"
          >
            Delete
          </button>
        </Task>
      ))} */}
    </div>
  );
}

export default TaskList;
