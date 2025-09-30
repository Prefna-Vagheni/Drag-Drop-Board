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
import { Plus, GripVertical } from 'lucide-react';
import DroppableColumn from './DroppableColumn';
import ConfirmDeleteModal from './ConfirmDeleteModal';

const columns = [
  { id: 'todo', title: 'To Do', bg: 'bg-gray-100', text: 'text-gray-700' },
  {
    id: 'inprogress',
    title: 'In Progress',
    bg: 'bg-blue-100',
    text: 'text-blue-700',
  },
  {
    id: 'completed',
    title: 'Completed',
    bg: 'bg-green-100',
    text: 'text-green-700',
  },
];

export default function DragDropTodoApp() {
  // load tasks (flat array). Each task: { id, title, status }
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved
      ? JSON.parse(saved)
      : [
          // optional initial data (remove if you don't want defaults)
          { id: '1', title: 'Buy groceries', status: 'todo' },
          { id: '2', title: 'Build example', status: 'inprogress' },
          { id: '3', title: 'Write tests', status: 'completed' },
        ];
  });

  const [activeId, setActiveId] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [newTask, setNewTask] = useState('');
  const [isDark, setIsDark] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  // Dark mode
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const getTasksByStatus = (status) => tasks.filter((t) => t.status === status);
  const activeTask = tasks.find((t) => t.id === activeId) || null;

  const handleDragStart = ({ active }) => {
    setActiveId(active.id);
  };

  /**
   * handleDragOver:
   * - detect if hovering a column (we register columns with useDroppable)
   * - or hovering another task (over.id will be that task id)
   * - if status must change, update tasks and insert the dragging item into the new list
   */
  const handleDragOver = ({ active, over }) => {
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    // If over is a column id (we register columns as droppable),
    // set newStatus to that column id.
    const columnHit = columns.find((c) => c.id === overId);
    let newStatus = null;
    let insertIndex = null; // where to insert in the new status list

    if (columnHit) {
      newStatus = columnHit.id;
      // insert at end of that column's tasks
      const tasksInNew = tasks.filter((t) => t.status === newStatus);
      insertIndex = tasksInNew.length; // append
    } else {
      // over is likely an item id
      const overTask = tasks.find((t) => t.id === overId);
      if (overTask) {
        newStatus = overTask.status;
        // we'll try to insert before the overTask within its column
        const tasksInNew = tasks.filter((t) => t.status === newStatus);
        insertIndex = tasksInNew.findIndex((t) => t.id === overId);
      }
    }

    // If newStatus equals current, nothing to do here
    if (!newStatus || activeTask.status === newStatus) return;

    // Remove active item from the list and re-insert with updated status
    setTasks((prev) => {
      // remove active
      const withoutActive = prev.filter((t) => t.id !== activeId);
      // create updated item
      const updatedActive = { ...activeTask, status: newStatus };

      // split lists by status so we can inject
      const result = [];
      for (const col of columns) {
        if (col.id === newStatus) {
          // items for this column: take existing (without active), then insert updatedActive at insertIndex
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

  /**
   * handleDragEnd:
   * - if dropped over an item in same column -> reorder that column
   * - if dropped over column or item in different column, the status should already have been updated
   *   by handleDragOver, so we just clear active
   */
  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    const overTask = tasks.find((t) => t.id === over.id);

    if (!activeTask || !overTask) return;

    // only reorder if they're in the same column
    if (activeTask.status === overTask.status) {
      const status = activeTask.status;
      const columnTasks = tasks.filter((t) => t.status === status);
      const oldIndex = columnTasks.findIndex((t) => t.id === active.id);
      const newIndex = columnTasks.findIndex((t) => t.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const newColumnOrder = arrayMove(columnTasks, oldIndex, newIndex);

        // reconstruct global tasks by replacing that column block
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
    };
    setTasks((prev) => [...prev, item]);
    setNewTask('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') addTask();
  };

  const confirmDelete = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    setTaskToDelete(null);
  };
  const cancelDelete = () => setTaskToDelete(null);
  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setIsDark(!isDark);
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 ">
            Drag & Drop To-Do Board
          </h1>
          <button
            onClick={toggleDarkMode}
            className=" top-4 right-4 bg-gray-200 dark:bg-gray-700 dark:text-gray-50 px-3 py-1 rounded text-sm cursor-pointer"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Add a new task..."
              className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addTask}
              className="bg-blue-500 dark:text-gray-400 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
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
                text={col.text}
                tasks={getTasksByStatus(col.id)}
                onDelete={setTaskToDelete}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="bg-white p-3 rounded-lg shadow-lg border-l-4 border-l-blue-400">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-800">
                    {activeTask.title}
                  </span>
                  <GripVertical size={14} className="text-gray-400" />
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
