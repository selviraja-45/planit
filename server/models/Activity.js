import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { _id: false });

const activitySchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  title: String,
  dateTime: Date,
  category: {
    type: String,
    enum: ['Adventure', 'Food', 'Sightseeing', 'Other']
  },
  estimatedCost: Number,
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  votes: [voteSchema]
}, { timestamps: true });

export default mongoose.model('Activity', activitySchema);
