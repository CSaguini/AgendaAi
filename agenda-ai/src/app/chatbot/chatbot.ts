import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chatbot.html',
})
export class Chatbot {
  showChat = false;
  input = '';
  messages: { text: string, sender: 'bot' | 'user', isHtml?: boolean }[] = [];

  toggleChat() {
    this.showChat = !this.showChat;
  }

  sendMessage() {
    const msg = this.input.trim();
    if (!msg) return;

    this.messages.push({ text: msg, sender: 'user' });
    this.input = '';

    // Processar resposta do bot
    setTimeout(() => {
      const botResponse = this.getBotResponse(msg);
      this.messages.push(botResponse);
    }, 300);
  }

  addBotMessage(text: string, isHtml: boolean = false) {
    this.messages.push({ text, sender: 'bot', isHtml });
  }

  getBotResponse(msg: string): { text: string, sender: 'bot', isHtml?: boolean } {
    const m = msg.toLowerCase();

    // Saudações
    if (m.match(/^(oi|olá|ola|hey|opa|e ai|eai|bom dia|boa tarde|boa noite)$/)) {
      return { text: '👋 Olá! Eu sou o Assistente AgendaAI! Quer ajuda com agendamentos ou em como cadastrar sua empresa?', sender: 'bot' };
    }

    // Como agendar
    if (m.match(/como ag(endar|endo)|fazer agendamento|quero agendar/)) {
      return {
        text: `Você pode fazer seu agendamento clicando no botão abaixo 👇<br>
               <a href="/home/duvida-agen" class="chatbot-link">📅 Ir para Agendamentos</a>`,
        sender: 'bot',
        isHtml: true
      };
    }

    // Como cadastrar empresa
    if (m.match(/cadastr(ar|o)|empresa|meu salão|registr(ar|o)|tenho empresa|como cadastrar minha empresa/)) {
      return {
        text: `Para cadastrar sua empresa, clique no link abaixo 👇<br>
               <a href="/home/duvida-empre" class="chatbot-link">🏢 Ir para Cadastro</a>`,
        sender: 'bot',
        isHtml: true
      };
    }

    // Dicas rápidas
    if (m.match(/cabelo/)) {
      return { text: '💇‍♀️ Quer dicas de cabelo seco, oleoso, cacheado ou crescimento?', sender: 'bot' };
    }

    if (m.match(/unha/)) {
      return { text: '💅 Quer dicas de unhas fracas, crescimento, micose ou durabilidade?', sender: 'bot' };
    }

    // Ajuda geral
    if (m.match(/ajuda|help|menu/)) {
      return { text: '❓ Você pode perguntar: "Como agendar?", "Como cadastrar minha empresa?", "Dicas de cabelo/unhas/pele/maquiagem"', sender: 'bot' };
    }

    // Despedida
    if (m.match(/tchau|adeus|até|obrigad/)) {
      return { text: '👋 Até mais! Volte sempre que precisar de ajuda com beleza e agendamentos.', sender: 'bot' };
    }

    // Padrão
    return { text: '🤔 Desculpe, não entendi. Pode reformular? Digite "ajuda" para opções.', sender: 'bot' };
  }
}
