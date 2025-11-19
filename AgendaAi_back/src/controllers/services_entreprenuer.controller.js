import { Entrepreneur } from "../models/Entrepreneur.js";
import { servicesEntreprenuer } from "../models/services_entreprenuer.js";

// Substitua a função Register COMPLETA
export const Register = async (req, res) => {
  const { nome, categoria, descricao, duracao, time, dias } =
    req.body;

  const { id } = req.params; 
  console.log('RECEBENDO ID', id);
  
  try {
    const createServiceEntreprenuer = await servicesEntreprenuer.create({
      nome: nome,
      categoria: categoria,
      descricao: descricao,
      duracao: duracao,
      time: time,
      dias: dias,
      entrepreneur: id
    });
    
    await createServiceEntreprenuer.save();
    
     await Entrepreneur.findByIdAndUpdate(id, { $push: { services_entreprenuer: createServiceEntreprenuer._id } }, {new: true})

    res.status(201).json(createServiceEntreprenuer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const GetAllServicesEntreprenuer = async (req, res) => {
  const { id } = req.params; // id da empresa
  try {
    const services = await servicesEntreprenuer.find().where('entrepreneur').equals(id);
    res.status(200).json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const UpdateServiceEntreprenuer = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const updatedService = await servicesEntreprenuer.findByIdAndUpdate(
      serviceId,
      req.body,
      { new: true }
    );
    if (!updatedService) {
      return res.status(404).json({ message: "Serviço não encontrado" });
    }
    res.json(updatedService);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar serviço" });
  }
};

export const DeleteServiceEntreprenuer = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const deleted = await servicesEntreprenuer.findByIdAndDelete(serviceId);

    if (!deleted) {
      return res.status(404).json({ message: "Serviço não encontrado" });
    }

    res.status(200).json({ message: "Serviço excluído com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir serviço:", error);
    res.status(500).json({ message: "Erro interno ao excluir serviço" });
  }
};