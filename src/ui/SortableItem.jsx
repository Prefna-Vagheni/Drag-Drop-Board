import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';

export default function SortableItem({
  id,
  title,
  status,
  onDelete,
  priority,
}) {
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
    // ...(isDragging ? { boxShadow: '0 6px 18px rgba(0,0,0,0.12)' } : {}),
    opacity: isDragging ? 0.5 : 1,
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

  const getPriorityLevel = (priority) => {
    switch (priority) {
      case 'low':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'high':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-gray-100 dark:bg-gray-700 p-3 rounded-lg shadow-sm border-l-4 ${getStatusColor(
        status
      )} ${
        isDragging ? 'opacity-50' : ''
      } hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing`}
    >
      <div className="flex items-center justify-between">
        <div className="flex gap-1 items-center">
          <div
            {...attributes}
            {...listeners}
            className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 p-1"
          >
            <GripVertical size={16} />
          </div>
          <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
            {title}
          </span>
        </div>
        <div className="flex gap-1 items-center">
          <span
            className={`ml-2 text-xs font-semibold px-2 py-1 rounded-full ${getPriorityLevel(
              priority
            )}`}
          >
            {priority}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-red-500 hover:text-red-700 transition-colors p-1"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
