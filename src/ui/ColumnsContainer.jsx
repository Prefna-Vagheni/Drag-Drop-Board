import DroppableColumn from './DroppableColumn';

function ColumnsContainer({
  columns,
  setColumns,
  tasks,
  setTaskToDelete,
  handleOpenDetails,
}) {
  const getTasksByStatus = (status) => tasks.filter((t) => t.status === status);

  const updateColumnsTitle = (id, newTitle) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === id ? { ...col, title: newTitle } : col))
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((col) => (
        <DroppableColumn
          key={col.id}
          id={col.id}
          title={col.title}
          bgColor={col.bg}
          textColor={col.text}
          tasks={getTasksByStatus(col.id)}
          onDelete={setTaskToDelete}
          onEditTitle={updateColumnsTitle}
          onEditDetails={handleOpenDetails}
        />
      ))}
    </div>
  );
}

export default ColumnsContainer;
