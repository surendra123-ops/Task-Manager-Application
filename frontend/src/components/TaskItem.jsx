const TaskItem = ({ task, onToggle, onEdit, onDelete }) => {
  const priorityColors = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-red-100 text-red-800 border-red-200',
  };

  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status === 'incomplete';

  return (
    <div className={`card hover:shadow-lg transition-shadow ${
      task.status === 'completed' ? 'opacity-75' : ''
    } ${isOverdue ? 'border-l-4 border-red-500' : ''}`}>
      <div className="flex items-start space-x-4">
        <input
          type="checkbox"
          checked={task.status === 'completed'}
          onChange={() => onToggle(task._id, task.status === 'completed' ? 'incomplete' : 'completed')}
          className="mt-1 h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-lg font-semibold ${
              task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
            }`}>
              {task.title}
            </h3>
            
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-md border ${
                priorityColors[task.priority]
              }`}>
                {task.priority.toUpperCase()}
              </span>
            </div>
          </div>

          {task.description && (
            <p className="text-gray-600 text-sm mb-3">{task.description}</p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              {task.deadline && (
                <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                  📅 {new Date(task.deadline).toLocaleDateString()}
                  {isOverdue && ' (Overdue)'}
                </span>
              )}
              <span>
                Created {new Date(task.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(task)}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => onDelete(task._id)}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;

