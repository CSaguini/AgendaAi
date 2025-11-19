import mongoose from 'mongoose';

const agendamentoSchema = new mongoose.Schema({
  // Referência ao Usuário que está agendando
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  // Referência à Empresa (já vem do Serviço, mas é bom ter para consultas rápidas)
  entrepreneur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Entrepreneur",
    required: true
  },
  // Referência ao Serviço que foi agendado
  services_entreprenuer: {
     type: mongoose.Schema.Types.ObjectId,
      ref: "servicesEntreprenuer",
      required: true
  },
    isActive: { type: Boolean, default: true },
    
  // Data e hora EXATA do início do agendamento
  data_hora: {
    type: Date,
    required: true,
    index: true, // Adicionar índice para otimizar buscas por data
  },
  status: {
    type: String,
    enum: ['agendado', 'concluido', 'cancelado'],
    default: 'agendado',
  },
  criado_em: {
    type: Date,
    default: Date.now,
  },
});

export const Agendamento = mongoose.model('Agendamento', agendamentoSchema);