import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { taskAPI } from '../services/api';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, filter, priorityFilter, searchQuery]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getTasks();
      setTasks(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = [...tasks];

    // Filter by status
    if (filter === 'completed') {
      filtered = filtered.filter(task => task.status === 'completed');
    } else if (filter === 'incomplete') {
      filtered = filtered.filter(task => task.status === 'incomplete');
    }

    // Filter by priority
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  };

  const handleCreateTask = async (taskData) => {
    try {
      const response = await taskAPI.createTask(taskData);
      setTasks([response.data, ...tasks]);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      const response = await taskAPI.updateTask(editingTask._id, taskData);
      setTasks(tasks.map(task => 
        task._id === editingTask._id ? response.data : task
      ));
      setEditingTask(null);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleToggleStatus = async (taskId, newStatus) => {
    try {
      const response = await taskAPI.updateTask(taskId, { status: newStatus });
      setTasks(tasks.map(task => 
        task._id === taskId ? response.data : task
      ));
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await taskAPI.deleteTask(taskId);
      setTasks(tasks.filter(task => task._id !== taskId));
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    incomplete: tasks.filter(t => t.status === 'incomplete').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Tasks</div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Completed</div>
            <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Incomplete</div>
            <div className="text-3xl font-bold text-orange-600">{stats.incomplete}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Task Form */}
          <div className="lg:col-span-1">
            <TaskForm
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              editTask={editingTask}
              onCancel={handleCancelEdit}
            />
          </div>

          {/* Task List */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <div className="card mb-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Tasks
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input"
                    placeholder="Search by title or description..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="input"
                    >
                      <option value="all">All Tasks</option>
                      <option value="incomplete">Incomplete</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="input"
                    >
                      <option value="all">All Priorities</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="card text-center py-12">
                <div className="text-4xl mb-4">⏳</div>
                <p className="text-gray-600">Loading tasks...</p>
              </div>
            ) : (
              <TaskList
                tasks={filteredTasks}
                onToggle={handleToggleStatus}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

