const mongoose = require('mongoose');
const Counter = require('./Counter');

const ticketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    unique: true
  },
  title: {
    type: String,
    required: [true, 'Ticket title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Hardware', 'Software', 'Network', 'Account', 'Email', 'Printer', 'Security', 'Other'],
    default: 'Other'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Pending', 'Resolved', 'Closed'],
    default: 'Open'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  attachments: [
    {
      filename: String,
      originalName: String,
      mimetype: String,
      size: Number,
      uploadedAt: { type: Date, default: Date.now }
    }
  ],
  tags: [{ type: String, trim: true }],
  sla: {
    deadline: { type: Date },
    breached: { type: Boolean, default: false },
    responseTime: { type: Number, default: null }, // in hours
    resolutionTime: { type: Number, default: null }  // in hours
  },
  resolution: {
    type: String,
    default: null
  },
  closedAt: {
    type: Date,
    default: null
  },
  feedback: {
    rating: { type: Number, min: 1, max: 5, default: null },
    comment: { type: String, default: null },
    submittedAt: { type: Date, default: null }
  },
  activityLog: [
    {
      action: String,
      performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      performedByName: String,
      oldValue: String,
      newValue: String,
      timestamp: { type: Date, default: Date.now }
    }
  ],
  views: { type: Number, default: 0 },
  isArchived: { type: Boolean, default: false }
}, { timestamps: true });

// Auto-generate ticket ID before save
ticketSchema.pre('save', async function (next) {
  if (!this.ticketId) {
    const seq = await Counter.getNextSequence('ticketId');
    this.ticketId = `TKT-${String(seq).padStart(4, '0')}`;
  }
  // Set SLA deadline based on priority
  if (!this.sla.deadline) {
    const hoursMap = { Low: 72, Medium: 24, High: 8, Critical: 4 };
    const hours = hoursMap[this.priority] || 24;
    this.sla.deadline = new Date(Date.now() + hours * 60 * 60 * 1000);
  }
  next();
});

// Index for search
ticketSchema.index({ title: 'text', description: 'text' });
ticketSchema.index({ status: 1, priority: 1 });
ticketSchema.index({ createdBy: 1 });
ticketSchema.index({ assignedTo: 1 });

module.exports = mongoose.model('Ticket', ticketSchema);
