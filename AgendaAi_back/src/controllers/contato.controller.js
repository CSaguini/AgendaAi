import { Contato } from "../models/contato.js"


export const Register = async (req, res) =>{
    const {email, telefone, assunto, mensagem} = req.body
   
    try {
      const contato = await Contato.create({
        email,
        telefone,
        assunto,
        mensagem
      })
      await contato.save()

      res.status(201).json(contato)
    } catch (error) {
        console.error(error)
        return res.status(500).json({message: "Internal server error"})
    }
}

export const ListarContatos = async (req, res) => {
  try {
    const contatos = await Contato.find().sort({ createdAt: -1 });
    res.status(200).json(contatos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar contatos" });
  }
};