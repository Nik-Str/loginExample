const mongoose = require('mongoose');

const authorizationSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  attempts: {
    type: Number,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

authorizationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 1800 });

module.exports = mongoose.model('authorization', authorizationSchema);
