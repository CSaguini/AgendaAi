import mongoose from "mongoose";

const servicesEntreprenuerSchema = new mongoose.Schema({ 
  nome: {
    type: String,
    required: true,
  },
  categoria:{
    type: String,
    required: true,
  },
  descricao: {
    type: String,
    required: true,
  },
  duracao: {
    type: Number,
    required: true,
  },
  time: [{
    id: { type: String, required: true },
    label: { type: String, required: true }
  }],
  dias: [{
    id: { type: String, required: true },
    label: { type: String, required: true }
  }],
  
  created_at: {
    type: Date,
    default: Date.now,
  },
  isActive: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  entrepreneur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Entrepreneur",
    required: true
  }

})

 export const servicesEntreprenuer = mongoose.model('servicesEntreprenuer', servicesEntreprenuerSchema)
