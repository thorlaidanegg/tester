import mongoose from 'mongoose';

const websiteSchema = new mongoose.Schema({
  url: { type: String, required: true },   // Website URL
  name: { type: String, required: true },   // Website NAME
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Associated user
  testCases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TestCase' }],  // Test cases for this website
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Website || mongoose.model('Website', websiteSchema);
