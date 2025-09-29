import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { GripVertical, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

const columns = [
  {
    id: 'todo',
    title: 'To-Do',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
  },
  {
    id: 'inprogress',
    title: 'In-Progress',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
  },
  {
    id: 'completed',
    title: 'Completed',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
  },
];

function TestDraDroppaleContainer() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks', tasks);
    return saved ? JSON.parse(saved) : [];
  });
  const [activeId, setActiveId] = useState(null);
  const [newTask, setNewTask] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGatter: sortableKeyboardCoordinates })
  );

  useEffect(
    () => localStorage.setItem('tasks', JSON.stringify(tasks)),
    [tasks]
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };
  const handleDragOver = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeTask = tasks.find((task) => task.id === active.id);
    const overId = over.id;

    //Check if we are hovering over a column or another task
    let newStatus;
    if (columns.find((col) => col.id === overId)) {
      //Hovering over a column
      newStatus = overId;
    } else {
      //Hover over a task, get its status
      const overTask = tasks.find((task) => task.id === overId);
      if (overTask) newStatus = overTask.status;
    }

    if (newStatus && activeTask && activeTask.status !== newStatus) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === active.id ? { ...task, status: newStatus } : task
        )
      );
    }
  };
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeTask = tasks.find((task) => task.id === active.id);
    const overTask = tasks.find((task) => task.id === over.id);

    if (activeTask && overTask && activeTask.status === overTask.status) {
      const activeIndex = tasks.findIndex((task) => task.id === active.id);
      const overIndex = tasks.findIndex((task) => task.id === over.id);

      if (activeIndex !== overIndex) {
        setTasks((prevTasks) => arrayMove(prevTasks, activeIndex, overIndex));
      }
    }
  };
  const addTask = () => {
    if (newTask.trim()) {
      const newTaskItem = {
        id: Date.now().toString(),
        title: newTask.trim(),
        status: 'todo',
      };
      setTasks([...tasks, newTaskItem]);
      setNewTask('');
    }
  };
  const handleOnKeyDown = (e) => {
    if (e.key === 'Enter') addTask();
  };
  const getTasksByStatus = () => {
    return tasks.filter((task) => task.status === activeId);
  };
  const activeTask = tasks.find((task) => task.id === activeId);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={handleOnKeyDown}
            placeholder="Add a new task..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 "
          />
          <button
            onClick={addTask}
            className="bg-blue-599 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={18} /> Add Task
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
          {columns.map((column) => (
            <DroppableColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={getTasksByStatus(column.id)}
              bgColor={column.bgColor}
              textColor={column.textColor}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="bg-white p-3 rounded-lg shadow-lg border-l-4 border-l-blue-400 rotate-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-800">
                  {activeTask.title}
                </span>
                <GripVertical size={16} className="text-gray-400" />
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}

export default TestDraDroppaleContainer;
