import Task from '../models/Task.js';

// @desc    Get all tasks for logged-in user
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    const { status, priority } = req.query;
    
    const filter = { user: req.user._id };
    
    if (status) {
      filter.status = status;
    }
    
    if (priority) {
      filter.priority = priority;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to view this task' });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, deadline } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Please provide a task title' });
    }

    const task = await Task.create({
      title,
      description,
      priority: priority || 'medium',
      deadline,
      user: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this task' });
    }

    const { title, description, status, priority, deadline } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title: title || task.title,
        description: description !== undefined ? description : task.description,
        status: status || task.status,
        priority: priority || task.priority,
        deadline: deadline !== undefined ? deadline : task.deadline,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Task deleted successfully', id: req.params.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

