import { GripVertical } from 'lucide-react';

function DragActiveTask({ activeTask }) {
  return (
    <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-lg border-l-4 border-l-blue-400 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
          {activeTask.title}
        </span>
        <GripVertical size={14} className="text-gray-400 dark:text-gray-300" />
      </div>
    </div>
  );
}

export default DragActiveTask;
