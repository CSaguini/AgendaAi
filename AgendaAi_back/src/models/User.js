import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
    },
    schedulings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Scheduling"
      }
    ],
    entrepreneur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Entrepreneur"
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    roles: {
      type: [String],
      enum: ['user', 'admin', 'entrepreneur'],
      default: ['user'],
    },
    isActive: { type: Boolean, default: true },
})


export const User = mongoose.model('User', userSchema)