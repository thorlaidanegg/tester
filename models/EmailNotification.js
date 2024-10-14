import mongoose from 'mongoose';

const emailNotificationSchema = new mongoose.Schema({
  user:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Associated user
  testRunHistory: { type: mongoose.Schema.Types.ObjectId, ref: 'TestRunHistory', required: true },  // Test run details
  emailSent: { type: Boolean, default: false },  // Whether the email was successfully sent
  sentAt: { type: Date },  // Date when the email was sent
});

export default mongoose.models?.EmailNotification || mongoose.model('EmailNotification', emailNotificationSchema);
