import mongoose from 'mongoose';

const testRunHistorySchema = new mongoose.Schema({
  testCase: { type: mongoose.Schema.Types.ObjectId, ref: 'TestCase', required: true },  // Test case that was run
  status: { type: String, enum: ['success', 'failure'], required: true },  // Test run status
  errorMessage: { type: String },  // Error message (if the test failed)
  videoUrl: { type: String },  // Optional video URL for test playback
  executionTime: { type: Number },  // Execution time in milliseconds
  runDate: { type: Date, default: Date.now },  // Date when the test was run
  scheduledRun: { type: Boolean, default: false },  // Whether it was a scheduled run
});

export default mongoose.models.TestRunHistory || mongoose.model('TestRunHistory', testRunHistorySchema);
