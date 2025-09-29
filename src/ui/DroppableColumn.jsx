import { verticalListSortingStrategy } from '@dnd-kit/sortable';

export default function DroppableColumn({ title, tasks, bgColor, textColor }) {
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
