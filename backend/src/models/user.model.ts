import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    index: true,
    required: true,
    trim: true,
    unique: true,
  },
  avatar: {
    type: String,
  },
});

export const User = mongoose.model("User", userSchema);
