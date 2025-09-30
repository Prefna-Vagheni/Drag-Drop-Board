function ConfirmDeleteModal({ taskToDelete, cancelDelete, confirmDelete }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 w-80">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-50 mb-4">
          Confirm Delete
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-50 mb-6">
          Are you sure you want to delete <strong>{taskToDelete.title}</strong>?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={cancelDelete}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => confirmDelete(taskToDelete.id)}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;
