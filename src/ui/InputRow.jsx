import { Plus } from 'lucide-react';

function InputRow({ newTask, setNewTask, setPriority, priority, setTasks }) {
  const addTask = () => {
    if (!newTask.trim()) return;
    const item = {
      id: Date.now().toString(),
      title: newTask.trim(),
      status: 'todo',
      priority: priority,
      description: '',
      dueDate: '',
    };
    setTasks((prev) => [...prev, item]);
    setNewTask('');
    setPriority('medium');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') addTask();
  };
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6 transition-colors">
      <div className="flex gap-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Add a new task..."
          className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="px-2 py-2 border bg-gray-700 text-gray-50 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button
          onClick={addTask}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={16} />
          Add
        </button>
      </div>
    </div>
  );
}

export default InputRow;
