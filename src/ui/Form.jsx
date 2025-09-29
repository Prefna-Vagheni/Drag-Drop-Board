import { useContext, useState } from 'react';
import { HiX } from 'react-icons/hi';
import { TaskContext } from '../context/TasksContext';

function Form({ setIsOpen }) {
  const { setTasks } = useContext(TaskContext);
  const [newTask, setNewTask] = useState('');
  const [title, setTitle] = useState('');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim() === '') return; // ✅ fixed validation

    const task = {
      id: Date.now(),
      title: title,
      text: newTask,

      completed: false,
    };

    setTasks((prev) => [...prev, task]);
    setIsOpen(false); // close after submit (optional)
    setNewTask('');
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center"
      onClick={() => setIsOpen(false)} // click outside closes
    >
      <form
        onClick={(e) => e.stopPropagation()} // prevent close on form click
        onSubmit={handleAddTask}
        className="relative z-50 w-[40rem] h-1/2 flex flex-col justify-center items-center bg-gray-100 bg-opacity-80 rounded-lg shadow-lg p-6"
      >
        {/* Close button */}
        <HiX
          className="absolute right-3 top-3 size-6 cursor-pointer hover:text-red-500 transition"
          onClick={() => setIsOpen(false)}
        />

        <label
          htmlFor="input-task"
          className="text-gray-700 text-2xl font-bold mb-2"
        >
          Enter Task
        </label>

        <textarea
          id="input-task"
          className="w-3xs h-24 p-2 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        ></textarea>
        <label
          htmlFor="input-title"
          className="text-gray-700 text-2xl font-bold mb-2"
        >
          Enter Title
        </label>

        <input
          type="text"
          id="input-title"
          className="w-3xs h-auto p-2 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button
          type="submit"
          className="cursor-pointer mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Submit task
        </button>
      </form>
    </div>
  );
}

export default Form;
