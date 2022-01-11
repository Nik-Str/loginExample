const mongoose = require('mongoose');

const resetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  key: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

resetSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

module.exports = mongoose.model('reset', resetSchema);
