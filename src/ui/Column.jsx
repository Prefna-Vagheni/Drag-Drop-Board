// import Task from './Task';

// function Column({ id, title, tasks }) {
//   return (
//     <div className="flex-1 bg-gray-100 rounded-lg p-4 min-h-[300px]">
//       <h2 className="font-bold mb-4">{title}</h2>
//       <SortableContext
//         items={tasks.map((t) => t.id)}
//         strategy={rectSortingStrategy}
//       >
//         {tasks.map((task) => (
//           <Task key={task.id} id={task.id} title={task.title} />
//         ))}
//       </SortableContext>
//     </div>
//   );
// }

// export default Column;

// ===============================
// ===============================
// ===============================
// ===============================
// ===============================
// ===============================
// ===============================
// ===============================
// ===============================
// ===============================
// ===============================
// ===============================
// ==================================

import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, GripVertical } from 'lucide-react';

// Sample initial data
const initialTasks = [
  { id: '1', title: 'Design homepage mockup', status: 'todo' },
  { id: '2', title: 'Set up project repository', status: 'todo' },
  { id: '3', title: 'Create user authentication', status: 'inprogress' },
  { id: '4', title: 'Write API documentation', status: 'inprogress' },
  { id: '5', title: 'Deploy to staging server', status: 'completed' },
  { id: '6', title: 'Initial project planning', status: 'completed' },
];

const columns = [
  {
    id: 'todo',
    title: 'To-Do',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
  },
  {
    id: 'inprogress',
    title: 'In Progress',
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

function SortableItem({ id, title, status }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo':
        return 'border-l-gray-400';
      case 'inprogress':
        return 'border-l-blue-400';
      case 'completed':
        return 'border-l-green-400';
      default:
        return 'border-l-gray-400';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`bg-red-400 p-3 rounded-lg shadow-sm border-l-4 ${getStatusColor(
        status
      )} ${
        isDragging ? 'opacity-50' : ''
      } hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-800">{title}</span>
        <div {...listeners} className="text-gray-400 hover:text-gray-600 p-1">
          <GripVertical size={16} />
        </div>
      </div>
    </div>
  );
}

function DroppableColumn({ title, tasks, bgColor, textColor }) {
  return (
    <div className={`${bgColor} p-4 rounded-lg min-h-[400px]`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`font-semibold text-lg ${textColor}`}>{title}</h2>
        <span
          className={`text-sm ${textColor} bg-white px-2 py-1 rounded-full`}
        >
          {tasks.length}
        </span>
      </div>
      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {tasks.map((task) => (
            <SortableItem
              key={task.id}
              id={task.id}
              title={task.title}
              status={task.status}
            />
          ))}
          {tasks.length === 0 && (
            <div className="text-gray-500 text-center py-8 text-sm">
              Drop tasks here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export default function DragDropTodoApp() {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeId, setActiveId] = useState(null);
  const [newTask, setNewTask] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeTask = tasks.find((task) => task.id === active.id);
    const overId = over.id;

    // Check if we're hovering over a column or another task
    let newStatus;
    if (columns.find((col) => col.id === overId)) {
      // Hovering over a column
      newStatus = overId;
    } else {
      // Hovering over a task, get its status
      const overTask = tasks.find((task) => task.id === overId);
      if (overTask) {
        newStatus = overTask.status;
      }
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  const activeTask = tasks.find((task) => task.id === activeId);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Drag & Drop To-Do Board
        </h1>

        {/* Add new task */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new task..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addTask}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={18} />
              Add Task
            </button>
          </div>
        </div>

        {/* Kanban Board */}
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
      </div>
    </div>
  );
}
