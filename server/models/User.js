import mongoose from 'mongoose';

/**
 * User Schema
 * - name: Name of the user (Required)
 * - email: Unique email ID (Required)
 * - passwordHash: Hashed password (Required)
 * - tripsCreated: References to created trips
 * - tripsInvited: References to invited trips
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
    },
    tripsCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }],
    tripsInvited: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }],
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
