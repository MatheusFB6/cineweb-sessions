🎬 CineWeb - Sistema de Gestão de Cinema

Imagem projeto: ![alt text](image.png)
Projeto acadêmico desenvolvido para a disciplina de Desenvolvimento Web Frontend.

O CineWeb é uma aplicação web SPA (Single Page Application) desenvolvida para gerenciar as operações administrativas de um cinema. O sistema permite o cadastro e controle de filmes, salas, agendamento de sessões e simulação de venda de ingressos.

🚀 Funcionalidades

🎥 Módulo de Filmes

- Listagem: Visualização de todos os filmes cadastrados em formato de cards.

- Cadastro/Edição: Formulário para adicionar novos filmes ou editar existentes (Título, Sinopse, Classificação, Duração, Gênero, Datas).

- Exclusão: Remoção de filmes do catálogo.

🚪 Módulo de Salas

- Gerenciamento: Cadastro e listagem de salas com sua respectiva numeração e capacidade máxima.

📅 Módulo de Sessões

- Agendamento Inteligente: Criação de sessões cruzando dados de Filmes e Salas existentes.

- Listagem Detalhada: Exibição das sessões com dados populados (Nome do filme e Sala real, não apenas IDs).

- Validação: Impede agendamentos com datas retroativas.

🎟️ Venda de Ingressos

- Simulação de Venda: Funcionalidade para registrar vendas de ingressos (Inteira ou Meia) vinculadas a uma sessão específica.

🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando as seguintes tecnologias e bibliotecas:

- Core: React + Vite (Template TypeScript)
- Linguagem: TypeScript
- Roteamento: React Router DOM
- Estilização: Bootstrap 5 + Bootstrap Icons
- Validação de Formulários: Zod
- API Simulada: Json-Server (Backend Mock)
- Requisições HTTP: Axios

📦 Como Rodar o Projeto

Siga os passos abaixo para executar o projeto em sua máquina local.

Pré-requisitos

Node.js instalado (versão 16 ou superior recomendada).

Passo a Passo

1. Clone o repositório

git clone <SEU_LINK_DO_GITHUB_AQUI>
cd cineweb-sessions


2. Instale as dependências

npm install


3. Inicie o Servidor Backend (Json-Server)
O projeto precisa que a API simulada esteja rodando para funcionar corretamente.

npm run server


O terminal mostrará: Resources: http://localhost:3000/filmes ...

4. Inicie o Frontend (React)
Em um novo terminal (mantenha o anterior aberto), rode:

npm run dev


5. Acesse a aplicação
Abra seu navegador e vá para o link indicado no terminal (geralmente http://localhost:5173).

📂 Estrutura do Projeto

/
├── public/              # Arquivos estáticos e db.json inicial
├── src/
│   ├── components/      # Componentes reutilizáveis (Forms, Listas, Navbar)
│   ├── pages/           # Páginas principais (Rotas)
│   ├── schemas/         # Esquemas de validação Zod
│   ├── services/        # Configuração do Axios e chamadas à API
│   └── types/           # Interfaces TypeScript
├── db.json              # Banco de dados simulado (Gerado na raiz ao rodar)
└── ...config files


📝 Autor

Desenvolvido por MatheusFB6 para atividade prática de Frontend.