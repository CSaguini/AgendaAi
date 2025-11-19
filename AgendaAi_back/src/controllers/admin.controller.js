import { User } from "../models/User.js";

export const listUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // não mostra a senha
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar usuários" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Usuário excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir usuário" });
  }
};
