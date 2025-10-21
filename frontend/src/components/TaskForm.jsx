import { useState, useEffect } from 'react';

const TaskForm = ({ onSubmit, editTask, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    deadline: '',
  });

  useEffect(() => {
    if (editTask) {
      setFormData({
        title: editTask.title || '',
        description: editTask.description || '',
        priority: editTask.priority || 'medium',
        deadline: editTask.deadline ? new Date(editTask.deadline).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        deadline: '',
      });
    }
  }, [editTask]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    if (!editTask) {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        deadline: '',
      });
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        {editTask ? 'Edit Task' : 'Create New Task'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input"
            placeholder="Enter task title"
            required
            maxLength={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input min-h-[100px] resize-y"
            placeholder="Enter task description (optional)"
            maxLength={500}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="input"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deadline
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>

        <div className="flex space-x-3">
          <button type="submit" className="btn btn-primary flex-1">
            {editTask ? 'Update Task' : 'Create Task'}
          </button>
          {editTask && (
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TaskForm;

