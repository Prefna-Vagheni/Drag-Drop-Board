import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableItem from './SortableItem';
import { useDroppable } from '@dnd-kit/core';
import { useState } from 'react';
import { Pencil } from 'lucide-react';

export default function DroppableColumn({
  title,
  tasks,
  bgColor,
  textColor,
  id,
  onDelete,
  onEditTitle,
  onEditDetails,
}) {
  const { setNodeRef: setDroppableNodeRef } = useDroppable({ id });
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);

  const handleBlur = () => {
    setIsEditing(false);
    onEditTitle(id, tempTitle.trim() || title);
  };

  return (
    <div
      ref={setDroppableNodeRef}
      className={`${bgColor}  p-4 rounded-lg h-[250px] overflow-y-auto`}
    >
      <div className="flex items-center justify-between mb-4">
        {isEditing ? (
          <input
            type="text"
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
            autoFocus
            className="px-2 py-1 text-gray-200 border rounded text-sm"
          />
        ) : (
          <div className="flex gap-2 items-center ">
            <h2
              className={`font-semibold text-lg ${textColor} dark:text-gray-100`}
            >
              {title}
            </h2>
            <span
              className="text-gray-200 hover:text-gray-300 transition-colors cursor-pointer p-1"
              onClick={() => setIsEditing(true)}
            >
              <Pencil size={18} />
            </span>
          </div>
        )}

        <span
          className={`text-sm ${textColor} dark:text-gray-200 bg-white dark:bg-gray-700 px-2 py-1 rounded-full`}
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
              task={task}
              onDelete={() => onDelete(task)}
              onEditDetails={onEditDetails}
            />
          ))}
          {tasks.length === 0 && (
            <div className="text-gray-500 dark:text-gray-400 text-center py-8 text-sm">
              No tasks yet. Drop a new one here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
