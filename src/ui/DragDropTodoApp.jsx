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
import TaskDetailModal from './TaskDetailModal';
import InputRow from './InputRow';
import ColumnsContainer from './ColumnsContainer';
import DragActiveTask from './DragActiveTask';
import Header from './Header';

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
            description: '',
            dueDate: '',
          },
          {
            id: '2',
            title: 'Build example',
            status: 'inprogress',
            priority: 'medium',
            description: '',
            dueDate: '',
          },
          {
            id: '3',
            title: 'Write tests',
            status: 'completed',
            priority: 'medium',
            description: '',
            dueDate: '',
          },
        ];
  });

  const [activeId, setActiveId] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [priority, setPriority] = useState('medium');
  const [selectedTask, setSelectedTask] = useState(null);
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

  // Dark mode initialization

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

  const handleSaveTaskDetails = (taskId, updates) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
    );
  };

  const confirmDelete = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    setTaskToDelete(null);
  };

  const cancelDelete = () => setTaskToDelete(null);

  const handleOpenDetails = (task) => {
    setSelectedTask(task);
  };

  // const handleSetTasks = (item) => setTasks((prev) => [...prev, item]);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      <div className="max-w-6xl mx-auto">
        <Header />

        <InputRow
          newTask={newTask}
          priority={priority}
          setNewTask={setNewTask}
          setPriority={setPriority}
          setTasks={setTasks}
        />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <ColumnsContainer
            columns={columns}
            tasks={tasks}
            setTaskToDelete={setTaskToDelete}
            setColumns={setColumns}
            handleOpenDetails={handleOpenDetails}
          />

          <DragOverlay>
            {activeTask ? <DragActiveTask activeTask={activeTask} /> : null}
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
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={handleSaveTaskDetails}
        />
      )}
    </div>
  );
}
