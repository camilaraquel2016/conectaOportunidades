# 🤖 AGENTS.md — Diretrizes de Governança e Regras de Código para IAs

Este documento estabelece as regras de conduta, arquitetura e limites de escopo que qualquer assistente de Inteligência Artificial (OpenCode, Cursor, Copilot, etc.) deve obedecer rigorosamente ao gerar ou refatorar código neste repositório.

---

## 🎯 1. Escopo Estrito e Limites de Execução (MVP 1)

A IA deve focar exclusivamente na implementação dos **4 Requisitos Funcionais** definidos em `ESPECIFICACAO-MVP.md`:

* **RF-01:** Cadastrar Oportunidade
* **RF-02:** Listar e Filtrar Oportunidades
* **RF-03:** Visualizar Detalhes e Registrar Evento de Consulta (Log)
* **RF-04:** Gerenciar Status da Oportunidade (ativa -> encerrada)

### ❌ Ações Proibidas (Lista Proibida para a IA):
1. **NÃO** criar tabelas, telas ou rotas de autenticação de usuários, login, cadastro de conta ou gestão de senhas (postergado para a Aula 10 via Supabase Auth).
2. **NÃO** implementar upload de arquivos (currículos em PDF, imagens ou anexos).
3. **NÃO** criar fluxos de inscrição direta na aplicação.
4. **NÃO** criar rotas de edição completa dos campos de uma oportunidade já cadastrada.
5. **NÃO** alterar a estrutura de diretórios do projeto sem autorização expressa no prompt.

---

## 🏗 2. Regras de Arquitetura do Back-end (Django REST Framework)

O código Back-end gerado pela IA deve obedecer obrigatoriamente a uma **Arquitetura em Camadas (Layered Architecture)** desacoplada:

* **[ Controller / ViewSet ]**: Validação de Contrato HTTP e Serializers
* **[ Service ]**: Concentração de Regras de Negócio e Lógica dos RFs
* **[ Repository ]**: Isolamento das Consultas do Django ORM ao PostgreSQL

### Regras de Código para o Back-end:
* **Controllers (`views.py` / `serializers.py`):** Devem apenas validar a entrada HTTP e retornar as respostas em formato JSON com os devidos Status Codes (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`). **É proibido colocar lógica de negócio dentro das Views!**
* **Services (`services/`):** Devem orquestrar as regras de negócio (ex: verificar se a vaga está ativa antes de gravar o log no RF-03).
* **Repositories (`repositories/`):** Devem isolar as consultas da ORM do Django.
* **Variáveis de Ambiente:** Todas as credenciais de acesso ao banco de dados (*Host*, *User*, *Password*, *Port*) devem ser lidas exclusivamente do arquivo `.env` através de `python-decouple` ou `os.getenv`. **Nunca expor chaves ou senhas no código!**

---

## 🎨 3. Regras de Arquitetura do Front-end (React + Tailwind CSS)

* **Interface Reativa:** Construído em componentes limpos, modulares e reutilizáveis (Cards, Modais, Badges de Categoria, Filtros).
* **Isolamento de Chamadas HTTP:** As requisições à API Django devem ser isoladas em um módulo dedicado (`src/services/api.js`).
* **Tratamento de Estados:** Tratar explicitamente estados de carregamento (*Loading*), lista vazia e erros de conexão HTTP com o usuário.
* **Interface e UX:** Design moderno, responsivo, acessível e profissional utilizando classes utilitárias do Tailwind CSS.

---

## 💾 4. Regras para o Banco de Dados (PostgreSQL / Supabase)

* **Database as Code:** Toda e qualquer alteração na estrutura do banco deve ser previamente escrita no arquivo `database/01_schema_inicial.sql`.
* **Inativação Lógica (Soft Delete):** Nunca utilizar comandos `DELETE SQL` para remover oportunidades. O encerramento de vagas deve ser feito alterando o campo `status` para `'encerrada'`.
* **Relações e Logs:** A tabela `visualizacoes_log` deve obrigatoriamente possuir chave estrangeira (FK) apontando para `oportunidades(id)` com `ON DELETE CASCADE`.

---

## 🧪 5. Formato de Resposta Exigido da IA

Ao gerar código ou responder a prompts do usuário, a IA deve:

1. Apresentar o código limpo, comentado nos pontos críticos e pronto para execução.
2. Indicar explicitamente o caminho do arquivo onde o código deve ser inserido (ex: `backend/oportunidades/services/oportunidade_service.py`).
3. Respeitar estritamente a stack definida: **Python / DRF / React / Tailwind / PostgreSQL**.