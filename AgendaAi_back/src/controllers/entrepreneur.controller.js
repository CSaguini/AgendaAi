import { Entrepreneur } from "../models/Entrepreneur.js"
import { User } from "../models/User.js"

export const Register = async (req, res) => {
  const { name, cpf, telefone, cep, rua, numero, comple, bairro, cidade, estado, image } = req.body;
  const { userId } = req.params;

  const format_cpf = cpf.replace(/\D/g, '');
  const format_telefone = telefone.replace(/\D/g, '');
  const format_cep = cep.replace(/\D/g, '');

  try {
    const verifyUser = await User.findById(userId).populate('entrepreneur').exec();

    if (verifyUser?.entrepreneur?.length > 0) {
      return res.status(400).json({ message: "Já existe uma empresa cadastrada com esse usuário" });
    }

    // Cria o empreendedor
    const entrepreneur = await Entrepreneur.create({
      name,
      cpf: Number(format_cpf),
      telefone: Number(format_telefone),
      cep: Number(format_cep),
      rua,
      numero,
      comple,
      bairro,
      cidade,
      estado,
      image,
      user: userId
    });

    // Atualiza o usuário adicionando o id do empreendedor
    await User.findByIdAndUpdate(userId, { $push: { entrepreneur: entrepreneur._id, roles: 'entrepreneur' } }, { new: true });

    // Retorna o empreendedor criado
    res.status(201).json(entrepreneur);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const Delete = async (req, res) => {
  const { id } = req.params
  console.log({
    id: id
  })
  try {
    // Exclui o documento do empreendedor
    await Entrepreneur.deleteOne({ user: id })

    // Remove a referência no User
    await User.findByIdAndUpdate(id, {
      $unset: { entrepreneur: id }
    })

    res.status(200).json({
      message: 'Empresa excluída com sucesso'
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const AllEntrepreneur = async (req, res) => {
  try {
    const entreprenuers = await Entrepreneur.find()

    res.status(200).json({
      empresas: entreprenuers
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({error: 'Internal server error'})
  }
}

export const GetEntreprenuerById = async (req, res) => {
  try {
    const { id } = req.params
    const entrepreneur = await Entrepreneur.find({ _id: id}).populate('services_entreprenuer')
    if (!entrepreneur) res.status(400).json({ message: 'Empresa não encontrada' })
    res.status(200).json(entrepreneur)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const UpdateEntreprenuer = async (req, res) => {
  try {
    const { id } = req.params
    const { name, telefone, cep, rua, numero, comple, bairro, cidade, estado, image } = req.body;
    const entreprenuer = await Entrepreneur.findByIdAndUpdate(id, {
      name: name,
      telefone: telefone,
      cep: cep,
      rua: rua,
      numero: numero,
      comple: comple,
      bairro: bairro,
      cidade: cidade,
      estado: estado,
      image: image
    })
    res.status(204).json({ message: 'Empresa modificada com sucesso!'})
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const ToggleStatusEntrepreneur = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const entrepreneur = await Entrepreneur.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );

    if (!entrepreneur) {
      return res.status(404).json({ message: "Empreendedor não encontrado" });
    }

    res.status(200).json({
      message: `Empreendedor ${isActive ? "ativado" : "inativado"} com sucesso!`,
      entrepreneur,
    });
  } catch (error) {
    console.error("Erro ao alterar status:", error);
    res.status(500).json({ message: "Erro ao alterar status do empreendedor." });
  }
};


export const SearchEntrepreneurByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Informe o nome da empresa para buscar." });
    }

    // Busca por nome parcial, sem diferenciar maiúsculas/minúsculas
    const results = await Entrepreneur.find({
      name: { $regex: name, $options: "i" },
    });

    if (results.length === 0) {
      return res.status(404).json({ message: "Nenhuma empresa encontrada." });
    }

    res.status(200).json(results);
  } catch (error) {
    console.error("Erro ao buscar empresa:", error);
    res.status(500).json({ message: "Erro interno ao buscar empresa." });
  }
};
