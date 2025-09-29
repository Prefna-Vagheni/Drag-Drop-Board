// import { useSortable } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';

import { useSortable } from '@dnd-kit/sortable';

// function Task({ id, title, children }) {
//   const { attributes, listeners, setNodeRef, transform, transition } =
//     useSortable({ id });
//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };

//   return (
//     <div
//       ref={setNodeRef}
//       {...attributes}
//       {...listeners}
//       style={style}
//       className="flex justify-between items-center p-3 bg-white shadow rounded"
//     >
//       {children}
//     </div>
//   );
// }

// export default Task;

export default function SortableItem({ id, title, status }) {
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
