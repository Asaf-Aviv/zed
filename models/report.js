const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;

const ReportSchema = new Schema({
  reportType: {
    type: String,
    required: true
  },
  reportedId: Schema.Types.ObjectId,
  created: {
    type: Date,
    default: Date.now
  },
  message: {
    type: String,
    required: true
  }
});

module.exports = Report = mongoose.model('reports', ReportSchema);