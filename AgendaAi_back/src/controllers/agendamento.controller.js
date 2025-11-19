import { servicesEntreprenuer } from "../models/services_entreprenuer.js";
import { Agendamento } from "../models/Agendamento.js";
import { parseISO, format, addMinutes, isSameDay, startOfDay } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

// Mapeamento dos dias da semana (JS/date-fns usa 0=Dom, 1=Seg, etc.)
const DAY_MAP = {
    'sunday': 0,
    'monday': 1,
    'tuesday': 2,
    'wednesday': 3,
    'thursday': 4,
    'friday': 5,
    'saturday': 6,
};

// Rota GET para buscar disponibilidade
export const GetDisponibilidade = async (req, res) => {
    const { serviceId } = req.params;
    const diasParaBuscar = 30; // Busca por 30 dias a partir de hoje
    const timezone = 'America/Sao_Paulo'; // Considere a timezone da sua empresa

    try {
        // 1. Obter a configuração do Serviço
        const servico = await servicesEntreprenuer.findById(serviceId);

        if (!servico) {
            return res.status(404).json({ message: "Serviço não encontrado." });
        }

        const duracaoMinutos = Number(servico.duracao);
        const diasDisponiveisIDs = servico.dias.map(d => d.id); // IDs dos dias permitidos (e.g., ['monday', 'tuesday'])
        const horariosPossiveis = servico.time.map(t => Number(t.id)); // Horas de início (e.g., [8, 9, 10])
        
        // 2. Definir o período de busca
        const now = new Date();
        const hojeZoned = utcToZonedTime(now, timezone);
        
        // CORREÇÃO: Começa a busca no início do dia de hoje (limpo) na timezone correta
        const diaInicial = startOfDay(hojeZoned); 
        
        const resultados = [];

        for (let i = 0; i < diasParaBuscar; i++) {
            // Avança um dia, mantendo a data limpa
            let dataAtual = addMinutes(diaInicial, i * 24 * 60); 
            
            // Garantir que a hora é 00:00:00 para evitar day shifts
            dataAtual.setHours(0, 0, 0, 0); 
            
            const diaDaSemana = format(dataAtual, 'EEEE').toLowerCase(); 
            
            // 3. Verifica se a Empresa está aberta neste dia
            if (!diasDisponiveisIDs.includes(diaDaSemana)) {
                continue; 
            }

            // O FORMATO CORRETO DE SAÍDA
            const dataFormatada = format(dataAtual, 'yyyy-MM-dd');
            const slotsDisponiveis = [];

            // 4. Gerar todos os slots possíveis para a dataAtual
            for (const horaInicial of horariosPossiveis) {
                
                let slotStart = new Date(dataAtual);
                slotStart.setHours(horaInicial, 0, 0, 0); 
                
                // Garantir que slots no passado de HOJE não são mostrados
                if (isSameDay(slotStart, hojeZoned) && slotStart <= hojeZoned) {
                     continue;
                }

                // Calcula o fim do slot
                const slotEnd = addMinutes(slotStart, duracaoMinutos);

                // Adiciona o slot formatado para verificação posterior
                slotsDisponiveis.push({
                    start: slotStart,
                    end: slotEnd,
                    horario_string: format(slotStart, 'HH:mm'), // Ex: "09:00"
                });
            }

            // 5. Buscar agendamentos existentes para este dia
            const diaInicio = new Date(dataAtual);
            diaInicio.setHours(0, 0, 0, 0);
            const diaFim = new Date(dataAtual);
            diaFim.setHours(23, 59, 59, 999);
            
            const agendamentosExistentes = await Agendamento.find({
                services_entreprenuer: serviceId, // CORREÇÃO: usar 'services_entreprenuer' conforme o Schema, não 'id_servico'
                data_hora: {
                    $gte: diaInicio,
                    $lte: diaFim,
                },
                status: 'agendado' 
            });

            // 6. Filtrar slots: remover aqueles que conflitam
            const slotsLivres = slotsDisponiveis.filter(slot => {
                const isConflito = agendamentosExistentes.some(agendamento => {
                    const agendamentoStart = agendamento.data_hora;
                    const agendamentoEnd = addMinutes(agendamentoStart, duracaoMinutos);

                    // Conflito 1: O agendamento existente começa dentro do nosso slot
                    if (agendamentoStart >= slot.start && agendamentoStart < slot.end) return true;
                    
                    // Conflito 2: O nosso slot começa dentro do tempo de serviço do agendamento existente
                    if (slot.start >= agendamentoStart && slot.start < agendamentoEnd) return true;
                    
                    return false;
                });
                
                return !isConflito;
            });
            
            // 7. Estruturar o resultado
            if (slotsLivres.length > 0) {
                resultados.push({
                    data: dataFormatada, 
                    horarios_disponiveis: slotsLivres.map(s => s.horario_string) 
                });
            }
        }

        res.status(200).json(resultados);

    } catch (error) {
        console.error("Erro ao buscar disponibilidade:", error);
        res.status(500).json({ message: "Erro interno ao buscar disponibilidade." });
    }
};

export const CreateAgendamento = async (req, res) => {
    const {
        user_id,
        services_entreprenuer,
        data_agendamento_iso 
    } = req.body;

    const timezone = 'America/Sao_Paulo'; 

    try {
        if (!user_id || !services_entreprenuer || !data_agendamento_iso) {
            return res.status(400).json({ message: "Dados de agendamento incompletos." });
        }

        const servico = await servicesEntreprenuer.findById(services_entreprenuer).select('duracao entrepreneur');
        if (!servico) {
            return res.status(404).json({ message: "Serviço não encontrado." });
        }
        
        const duracaoMinutos = Number(servico.duracao);
        const entrepreneur = servico.entrepreneur; 

        // 3. Converter e calcular o período do agendamento
        const data_hora_agendada = new Date(data_agendamento_iso);
        const fim_agendamento = addMinutes(data_hora_agendada, duracaoMinutos);

        // 4. VALIDAÇÃO CRÍTICA (Race Condition Check)
        // Busca por qualquer agendamento existente que conflite com o novo horário.
        const conflitoExistente = await Agendamento.findOne({
            services_entreprenuer: services_entreprenuer,
            status: 'agendado', 
            $or: [
                // Conflito 1: Um agendamento existente começa dentro do novo slot
                { 
                    data_hora: { 
                        $gte: data_hora_agendada, 
                        $lt: fim_agendamento 
                    } 
                },
                // Conflito 2: O novo slot começa durante um agendamento existente
                { 
                    data_hora: { 
                        $lt: data_hora_agendada 
                    },
                    // Verifica se o tempo de fim do agendamento existente
                    // é posterior ao início do novo agendamento.
                    $expr: {
                        $gt: [
                            { $add: ["$data_hora", duracaoMinutos * 60000] }, // Agendamento existente termina...
                            data_hora_agendada // ...depois do novo agendamento começar
                        ]
                    }
                }
            ]
        });

        if (conflitoExistente) {
            return res.status(409).json({ 
                message: "Este horário não está mais disponível. Por favor, escolha outro.",
                code: "SLOT_TAKEN"
            });
        }
        
        // 5. Se não houver conflito, cria o novo agendamento
        const novoAgendamento = await Agendamento.create({
            user_id: user_id,
            services_entreprenuer: services_entreprenuer,
            entrepreneur: entrepreneur,
            data_hora: data_hora_agendada, 
        });

        res.status(201).json({ 
            message: "Agendamento realizado com sucesso!",
            agendamento: novoAgendamento
        });

    } catch (error) {
        console.error("Erro ao criar agendamento:", error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
};