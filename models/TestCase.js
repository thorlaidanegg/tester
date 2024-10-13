import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema({
  name: { type: String, required: true },  // Name of the test case
  script: { type: String, required: true },  // Playwright script as a string
  videoPath: { type: String },  // Optional path to video recording of the test case
  website: { type: mongoose.Schema.Types.ObjectId, ref: 'Website', required: true },  // Associated website
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.TestCase || mongoose.model('TestCase', testCaseSchema);
