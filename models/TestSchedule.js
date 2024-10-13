import mongoose from 'mongoose';

const testScheduleSchema = new mongoose.Schema({
  testCase: { type: mongoose.Schema.Types.ObjectId, ref: 'TestCase', required: true },  // Test case to be run
  runTime: { type: Date, required: true },  // Date and time for scheduled test run
  repeat: { type: String, enum: ['none', 'daily', 'weekly', 'monthly'], default: 'none' },  // Recurrence pattern
  lastRunDate: { type: Date },  // Last time the test was run
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },  // Current status
});

export default mongoose.models.TestSchedule || mongoose.model('TestSchedule', testScheduleSchema);
