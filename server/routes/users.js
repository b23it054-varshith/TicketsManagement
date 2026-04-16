const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const { protect, authorize } = require('../middleware/auth');

// @route GET /api/users — Admin: list all users
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, users, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/users/agents — Get all active agents (for assignment dropdowns)
router.get('/agents', protect, authorize('admin', 'agent'), async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent', isActive: true }).select('name email department');
    res.json({ success: true, agents });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route PUT /api/users/profile — Update own profile (MUST be before /:id)
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, department } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, department },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/users/:id — Get single user
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route PUT /api/users/:id — Admin: update user role/status
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { role, isActive, department } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, isActive, department },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
