// ====================================================================
// 🤖 Controller do Chatbot com OpenAI API
// ====================================================================

/*import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const responderMensagem = async (req, res) => {
  try {
    const { mensagem } = req.body;

    if (!mensagem) {
      return res.status(400).json({ resposta: "Por favor, envie uma mensagem." });
    }

    // Prompt base do chatbot
    const contexto = `
      Você é o assistente virtual de um sistema de agendamento chamado AgendaAI.
      Responda sempre em português, de forma amigável, objetiva e natural.
      Seja educado, breve e evite respostas muito longas.
    `;

    // Requisição para o modelo GPT
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // rápido e econômico
      messages: [
        { role: "system", content: contexto },
        { role: "user", content: mensagem }
      ],
    });

    const resposta = completion.choices[0].message.content;

    res.json({ resposta });
  } catch (error) {
    console.error("Erro ao gerar resposta:", error);
    res.status(500).json({
      resposta: "❌ Ocorreu um erro ao se comunicar com a IA. Tente novamente mais tarde.",
    });
  }
};*/
