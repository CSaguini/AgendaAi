import { Scheduling } from "../models/Scheduling.js";
import { servicesEntreprenuer } from "../models/services_entreprenuer.js";

// Converte "10:00" em minutos (600)
function toMinutes(timeString) {
  const [h, m] = timeString.split(":").map(Number);
  return h * 60 + m;
}

// Converte minutos em "10:45"
function toTimeString(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
export const getAvailableHours = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { date } = req.query; // YYYY-MM-DD

    const service = await servicesEntreprenuer.findById(serviceId);

    if (!service) {
      return res.status(404).json({ message: "Serviço não encontrado" });
    }

    // Dias permitidos pelo serviço
    const dayOfWeek = new Date(date + "T00:00:00").getDay();
    const allowedDays = service.dias.map(d => d.id); // ["monday","tuesday",...]
    const allowedWeekdays = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];

    if (!allowedDays.includes(allowedWeekdays[dayOfWeek])) {
      return res.status(200).json([]); // nenhum horário nesse dia
    }

    // Horários cadastrados no serviço
    const availableTimes = service.time.map(t => t.label); // ["08:00","09:00",...]
    const duration = service.duracao; // ex: 40 min

    // Agendamentos já feitos nesse dia
    const scheduled = await Scheduling.find({
      services_entrepreneur_id: serviceId,
      date
    });

    const bookedHours = scheduled.map(s => ({
      start: s.hourInitial,
      end: s.hourEnd
    }));

    const possibleHours = [];

    for (const hour of availableTimes) {
      const startMinutes = toMinutes(hour);
      const endMinutes = startMinutes + duration;
      const endHour = toTimeString(endMinutes);

      // Verifica colisão
      const conflict = bookedHours.some(b => {
        const bStart = toMinutes(b.start);
        const bEnd = toMinutes(b.end);
        return !(endMinutes <= bStart || startMinutes >= bEnd);
      });

      if (!conflict) {
        possibleHours.push(hour);
      }
    }

    return res.status(200).json(possibleHours);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro interno ao buscar horários" });
  }
};

export const createScheduling = async (req, res) => {
  try {
    const { name, age, descricao, date, hourInitial, user_id, services_entrepreneur_id } = req.body;

    const service = await servicesEntreprenuer.findById(services_entrepreneur_id);

    if (!service) {
      return res.status(404).json({ message: "Serviço não encontrado" });
    }

    const duration = service.duracao; // minutos

    const startMinutes = toMinutes(hourInitial);
    const endMinutes = startMinutes + duration;
    const hourEnd = toTimeString(endMinutes);

    // Verificar conflito
    const conflict = await Scheduling.findOne({
      services_entrepreneur_id,
      date,
      $or: [
        { hourInitial: { $lt: hourEnd }, hourEnd: { $gt: hourInitial } }
      ]
    });

    if (conflict) {
      return res.status(400).json({ message: "Horário indisponível" });
    }

    const newScheduling = await Scheduling.create({
      name,
      age,
      descricao,
      date,
      hourInitial,
      hourEnd,
      user_id,
      services_entrepreneur_id
    });

    return res.status(201).json(newScheduling);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro interno ao criar agendamento" });
  }
};

export const getUserSchedulings = async (req, res) => {
  try {
    const { userId } = req.params;

    const schedulings = await Scheduling.find({ user_id: userId })
      .sort({ date: 1, hourInitial: 1 });

    res.status(200).json(schedulings);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar agendamentos" });
  }
};

export const getServiceSchedulings = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const schedulings = await Scheduling.find({ services_entrepreneur_id: serviceId })
      .sort({ date: 1, hourInitial: 1 });

    res.status(200).json(schedulings);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar agendamentos do serviço" });
  }
};

export const cancelScheduling = async (req, res) => {
  try {
    const { id } = req.params;

    await Scheduling.findByIdAndDelete(id);

    return res.status(200).json({ message: "Agendamento cancelado" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao cancelar" });
  }
};
