import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, select:false},
  name: { type: String, required: true },
  googleId: { type: String },
  websites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Website' }], // Websites owned by the user
  emailVerified: { type: Boolean, default: false },  // Email verification status
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models?.User || mongoose.model('User', userSchema);
