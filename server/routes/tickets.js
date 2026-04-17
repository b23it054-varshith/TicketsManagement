const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const Comment = require('../models/Comment');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');


// @route GET /api/tickets
router.get('/', protect, async (req, res) => {
  try {
    const { status, priority, category, search, page = 1, limit = 10 } = req.query;
    const filter = {};

    // Users only see their own tickets, agents see assigned tickets
    if (req.user.role === 'user') filter.createdBy = req.user._id;
    else if (req.user.role === 'agent') filter.assignedTo = req.user._id;

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Ticket.countDocuments(filter);
    const tickets = await Ticket.find(filter)
      .populate('createdBy', 'name email department')
      .populate('assignedTo', 'name email')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, tickets, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/tickets
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, category, priority, department } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ success: false, message: 'Title, description and category are required' });
    }

    const ticket = await Ticket.create({
      title,
      description,
      category,
      priority,
      department,
      createdBy: req.user._id
    });

    const populated = await ticket.populate([
      { path: 'createdBy', select: 'name email' },
      { path: 'assignedTo', select: 'name email' }
    ]);

    res.status(201).json({ success: true, ticket: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/tickets/stats
router.get('/stats', protect, async (req, res) => {
  try {
    const filter = req.user.role === 'user'
      ? { createdBy: req.user._id }
      : req.user.role === 'agent'
      ? { assignedTo: req.user._id }
      : {};

    const [open, inProgress, resolved, closed, total] = await Promise.all([
      Ticket.countDocuments({ ...filter, status: 'Open' }),
      Ticket.countDocuments({ ...filter, status: 'In Progress' }),
      Ticket.countDocuments({ ...filter, status: 'Resolved' }),
      Ticket.countDocuments({ ...filter, status: 'Closed' }),
      Ticket.countDocuments(filter)
    ]);

    res.json({ success: true, stats: { open, inProgress, resolved, closed, total } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/tickets/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'name email department phone')
      .populate('assignedTo', 'name email department');

    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

    // Users can only view their own tickets
    if (req.user.role === 'user' && ticket.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const comments = await Comment.find({ ticket: ticket._id })
      .populate('author', 'name email role')
      .sort({ createdAt: 1 });

    res.json({ success: true, ticket, comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route PUT /api/tickets/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

    const isAdmin = req.user.role === 'admin';
    const isAssignedAgent = req.user._id.toString() === ticket.assignedTo?.toString();
    const isCreator = req.user._id.toString() === ticket.createdBy?.toString();

    if (!isAdmin && !isAssignedAgent && !isCreator) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this ticket' });
    }

    const { status, priority, assignedTo, title, description, category } = req.body;

    if (status) ticket.status = status;
    if (priority) ticket.priority = priority;
    if (assignedTo !== undefined) ticket.assignedTo = assignedTo;
    if (title) ticket.title = title;
    if (description) ticket.description = description;
    if (category) ticket.category = category;

    await ticket.save();

    const populated = await ticket.populate([
      { path: 'createdBy', select: 'name email' },
      { path: 'assignedTo', select: 'name email' }
    ]);

    res.json({ success: true, ticket: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/tickets/:id/comments
router.post('/:id/comments', protect, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

    const { body } = req.body;
    if (!body || !body.trim()) {
      return res.status(400).json({ success: false, message: 'Comment cannot be empty' });
    }

    const comment = await Comment.create({
      ticket: ticket._id,
      author: req.user._id,
      content: body
    });

    const populated = await comment.populate('author', 'name email role');

    res.status(201).json({ success: true, comment: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route DELETE /api/tickets/:id  (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ ticket: req.params.id });
    res.json({ success: true, message: 'Ticket deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
