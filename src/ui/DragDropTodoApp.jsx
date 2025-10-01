import { useEffect, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Plus, GripVertical, Sun, Moon } from 'lucide-react';
import DroppableColumn from './DroppableColumn';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import ThemeToggle from './ThemeToggle';

const defaultColumns = [
  {
    id: 'todo',
    title: 'To Do',
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-700 dark:text-gray-200',
  },
  {
    id: 'inprogress',
    title: 'In Progress',
    bg: 'bg-blue-100 dark:bg-blue-900/50',
    text: 'text-blue-700 dark:text-blue-200',
  },
  {
    id: 'completed',
    title: 'Completed',
    bg: 'bg-green-100 dark:bg-green-900/50',
    text: 'text-green-700 dark:text-green-200',
  },
];

export default function DragDropTodoApp() {
  const [columns, setColumns] = useState(() => {
    const saved = localStorage.getItem('columns');
    return saved ? JSON.parse(saved) : defaultColumns;
  });

  // load tasks (flat array). Each task: { id, title, status }
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: '1',
            title: 'Buy groceries',
            status: 'todo',
            priority: 'medium',
          },
          {
            id: '2',
            title: 'Build example',
            status: 'inprogress',
            priority: 'medium',
          },
          {
            id: '3',
            title: 'Write tests',
            status: 'completed',
            priority: 'medium',
          },
        ];
  });

  const [activeId, setActiveId] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [priority, setPriority] = useState('medium');
  const [newTask, setNewTask] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Persist columns
  useEffect(() => {
    localStorage.setItem('columns', JSON.stringify(columns));
  }, [columns]);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Get function
  const updateColumnsTitle = (id, newTitle) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === id ? { ...col, title: newTitle } : col))
    );
  };
  // Dark mode initialization
  const getTasksByStatus = (status) => tasks.filter((t) => t.status === status);
  const activeTask = tasks.find((t) => t.id === activeId) || null;

  const handleDragStart = ({ active }) => {
    setActiveId(active.id);
  };

  const handleDragOver = ({ active, over }) => {
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    const columnHit = columns.find((c) => c.id === overId);
    let newStatus = null;
    let insertIndex = null;

    if (columnHit) {
      newStatus = columnHit.id;
      const tasksInNew = tasks.filter((t) => t.status === newStatus);
      insertIndex = tasksInNew.length;
    } else {
      const overTask = tasks.find((t) => t.id === overId);
      if (overTask) {
        newStatus = overTask.status;
        const tasksInNew = tasks.filter((t) => t.status === newStatus);
        insertIndex = tasksInNew.findIndex((t) => t.id === overId);
      }
    }

    if (!newStatus || activeTask.status === newStatus) return;

    setTasks((prev) => {
      const withoutActive = prev.filter((t) => t.id !== activeId);
      const updatedActive = { ...activeTask, status: newStatus };

      const result = [];
      for (const col of columns) {
        if (col.id === newStatus) {
          const list = withoutActive.filter((t) => t.status === col.id);
          const before = list.slice(0, insertIndex);
          const after = list.slice(insertIndex);
          result.push(...before, updatedActive, ...after);
        } else {
          result.push(...withoutActive.filter((t) => t.status === col.id));
        }
      }
      return result;
    });
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    const overTask = tasks.find((t) => t.id === over.id);

    if (!activeTask || !overTask) return;

    if (activeTask.status === overTask.status) {
      const status = activeTask.status;
      const columnTasks = tasks.filter((t) => t.status === status);
      const oldIndex = columnTasks.findIndex((t) => t.id === active.id);
      const newIndex = columnTasks.findIndex((t) => t.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const newColumnOrder = arrayMove(columnTasks, oldIndex, newIndex);

        const newTasks = [];
        for (const col of columns) {
          if (col.id === status) {
            newTasks.push(...newColumnOrder);
          } else {
            newTasks.push(...tasks.filter((t) => t.status === col.id));
          }
        }
        setTasks(newTasks);
      }
    }
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    const item = {
      id: Date.now().toString(),
      title: newTask.trim(),
      status: 'todo',
      priority: priority,
    };
    setTasks((prev) => [...prev, item]);
    setNewTask('');
    setPriority('medium');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') addTask();
  };

  const confirmDelete = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    setTaskToDelete(null);
  };

  const cancelDelete = () => setTaskToDelete(null);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Drag & Drop To-Do Board
          </h1>
          <ThemeToggle />
        </div>

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

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((col) => (
              <DroppableColumn
                key={col.id}
                id={col.id}
                title={col.title}
                bgColor={col.bg}
                textColor={col.text}
                tasks={getTasksByStatus(col.id)}
                onDelete={setTaskToDelete}
                onEditTitle={updateColumnsTitle}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-lg border-l-4 border-l-blue-400 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {activeTask.title}
                  </span>
                  <GripVertical
                    size={14}
                    className="text-gray-400 dark:text-gray-300"
                  />
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
      {taskToDelete && (
        <ConfirmDeleteModal
          taskToDelete={taskToDelete}
          cancelDelete={cancelDelete}
          confirmDelete={confirmDelete}
        />
      )}
    </div>
  );
}
