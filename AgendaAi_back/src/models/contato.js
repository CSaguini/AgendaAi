import mongoose from "mongoose";

const contatoSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true, // ✅ corrigido
    },
    telefone: {
      type: String,
      required: true, // ✅ corrigido
      maxLength: 12, // ✅ corrigido
    },
    assunto: {
      type: String,
      required: true,
    },
    mensagem: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // ✅ cria automaticamente createdAt e updatedAt
);

export const Contato = mongoose.model("Contato", contatoSchema);
