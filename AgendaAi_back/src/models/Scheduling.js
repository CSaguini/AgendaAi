import mongoose from "mongoose";

const schedulingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  age: {
    type: Number,
    required: true,
  },

  descricao: {
    type: String,
    required: false,
  },

  date: {
    type: String, // YYYY-MM-DD
    required: true,
  },

  hourInitial: {
    type: String, // "10:00"
    required: true,
  },

  hourEnd: {
    type: String, // calculado automaticamente
    required: true,
  },

  imagem: {
    type: String,
    required: false,
  },

  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  services_entrepreneur_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "servicesEntreprenuer",
    required: true,
  },

  created_at: {
    type: Date,
    default: Date.now,
  }
});

export const Scheduling = mongoose.model("Scheduling", schedulingSchema);
