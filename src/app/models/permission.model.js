const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  code: { type: String, unique: true }, // STAFF_VIEW
  name: String,

  featureId: { type: mongoose.Schema.Types.ObjectId, ref: 'Feature' },
  menuId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuData' },

  action: {
    type: String,
    enum: ['view', 'create', 'edit', 'delete', 'export'],
  },
});

module.exports = mongoose.model('Permission', permissionSchema);
