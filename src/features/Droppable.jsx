import { useDroppable } from '@dnd-kit/core';

export default function Droppable({ children }) {
  const { isOver, setNodeRef } = useDroppable({ id: 'droppable' });
  const style = { color: isOver ? 'green' : undefined };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}
