# Projeto AgendaAI - Sistema de Agendamento Inteligente

O AgendaAI é uma aplicação Full Stack desenvolvida para conectar usuários a empreendedores e seus serviços, permitindo o agendamento de horários de forma inteligente e com verificação de conflitos.

# O projeto está dividido em duas pastas principais:

AgendaAi_back: A API RESTful (Backend) em Node.js.

agenda-ai: A Interface do Usuário (Frontend) em Angular.

# Funcionalidades PrincipaisUsuário (Frontend e Backend)Autenticação Completa:

Cadastro, Login e redefinição de senha via e-mail.

Busca e Visualização: Pesquisa por estabelecimentos (empreendedores).

Agendamento Inteligente: Consulta de horários disponíveis, considerando a duração do serviço e conflitos com agendamentos existentes.

# Empreendedor

Gestão do Estabelecimento: Cadastro de dados e gerenciamento do perfil do negócio.

Gerenciamento de Serviços: CRUD de serviços, definindo duração, dias e horários de funcionamento.

Upload de Imagens: Suporte para upload de fotos de perfil e estabelecimentos.

# Administração

Painel de Controle: Gestão de usuários, empresas e moderação de reclamações.

# Tecnologias Utilizadas

Componente	Tecnologia	Framework/Banco de Dados	Dependências Chave
Frontend	Angular (TypeScript)	Angular CLI	primeng, rxjs, bootstrap.
Backend	Node.js	Express	mongoose, bcrypt, jsonwebtoken, nodemailer.
Banco de Dados	MongoDB	Mongoose	date-fns (para lógica de agendamento).

# Passo a Passo para Execução (Setup Completo)

Para rodar o sistema completo, siga as instruções para configurar e iniciar o Backend e o Frontend.

1. Pré-requisitos
Node.js (v16 ou superior)

MongoDB (acessível)

Angular CLI: Instale globalmente com npm install -g @angular/cli.

2. Configuração e Inicialização do Backend (AgendaAi_back)
Navegue para a pasta do Backend:

cd AgendaAi_back

2. Instale as dependências:
   npm install

3. Crie o arquivo de ambiente (.env):
Crie um arquivo chamado .env na pasta AgendaAi_back e preencha as variáveis:

# Conexão com o Banco de Dados MongoDB
MONGO_URI=mongodb://127.0.0.1:27017/agenda_ai_db 

# Chave Secreta para Tokens JWT
SECRET_KEY="SUA_CHAVE_SECRETA_MUITO_FORTE"

# Configurações do Nodemailer
EMAIL_USER=seu_email_aqui@gmail.com

EMAIL_PASS=sua_app_password_aqui

4. Inicie o servidor (Modo Desenvolvimento):
   npm run dev

O Backend estará rodando em http://localhost:3000.

3. Configuração e Inicialização do Frontend (agenda-ai)
Abra um novo terminal e navegue para a pasta do Frontend:

   cd ../agenda-ai

2. Instale as dependências:
   npm install

3. Inicie a Aplicação Angular:
   ng serve
# ou 
npm start

O Frontend será compilado e estará acessível em http://localhost:4200.

