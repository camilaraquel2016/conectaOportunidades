# 📄 ESPECIFICACAO-MVP.md — Contratos Funcionais, Regras de Negócio e BDD

Este documento formaliza as regras de negócio, contratos de dados da API RESTful, arquitetura de software e cenários BDD para a versão 1.0 (MVP) do **OportunizaHub**.

---

## 🏛 Arquitetura de Software e Evolução em Fases

### Arquitetura Back-end (Django REST Framework)
Organizado em **Camadas Desacopladas (Layered Architecture)**:
* **Controllers / Views:** Recebimento de requisições HTTP, validação de contrato e retorno dos Status Codes e payloads JSON.
* **Services:** Concentração de todas as regras de negócio e orquestração de eventos (como gravação de logs de consulta).
* **Repositories:** Abstração de acesso à base de dados via Django ORM.

### Arquitetura Front-end
Interface web reativa construída em **React.js + Tailwind CSS**, consumindo a API RESTful de forma assíncrona.

### Estratégia de Controle no MVP 1
A separação entre as visões pública (Candidato) e administrativa (Anunciante) ocorre por rotas e componentes na interface (Front-end). O banco de dados PostgreSQL (Supabase) utiliza RLS com políticas permissivas temporárias para validação da gravação relacional sem acoplamento inicial de telas de login.

### Evolução para a Aula 10
Implementação do módulo **Supabase Auth**, inclusão do campo `user_id` e aplicação de políticas RLS restritas (`auth.uid() = user_id`).

---

## 🛠 Requisitos Funcionais e Contratos da API

### 📌 RF-01: Cadastrar Oportunidade

* **Ator:** Anunciante / Representante de Empresa ou Instituição.

#### Entradas Exatas e Limites:
* `titulo`: Texto (obrigatório, mínimo 5 e máximo 100 caracteres).
* `tipo_categoria`: Seleção obrigatória (`curso`, `oficina`, `emprego`, `estagio`).
* `instituicao_empresa`: Texto (obrigatório, máximo 100 caracteres).
* `descricao_requisitos`: Texto detalhado (obrigatório, máximo 1000 caracteres).
* `link_ou_contato`: URL, e-mail ou WhatsApp válido (obrigatório, máximo 255 caracteres).

#### Regras de Negócio (Camada Service):
1. Todos os campos são de preenchimento obrigatório.
2. O campo `link_ou_contato` deve obrigatoriamente possuir um formato válido (URL iniciada em `http://` ou `https://`, e-mail com `@` ou telefone com DDD).
3. A oportunidade cadastrada nasce por padrão com o status `ativa`.

#### Saída Observável:
* **API (Back-end):** Retorno do código `HTTP 201 Created` contendo o payload JSON da oportunidade criada.
* **Banco de Dados (Repository):** Inserção e persistência da nova linha na tabela `oportunidades`.
* **Interface (Front-end):** Exibição da mensagem *"Oportunidade cadastrada com sucesso!"* e limpeza do formulário.

#### Cenários BDD — RF-01:

* **Cenário de Sucesso (BDD):**
  * **Dado** que o anunciante preenche o título "Oficina de Python para Iniciantes", seleciona a categoria "oficina", informa a instituição "IFPI", detalha os requisitos e insere o link `https://ifpi.edu.br/extensao`,
  * **Quando** solicita a publicação da oportunidade,
  * **Então** a API valida os dados, persiste o registro na base relacional com status `ativa`, retorna `HTTP 201 Created` e a interface exibe a mensagem *"Oportunidade cadastrada com sucesso!"*.

* **Cenário de Falha 1 - Campo Obrigatório Ausente (BDD):**
  * **Dado** que o anunciante tenta submeter o formulário deixando o campo `titulo` ou `descricao_requisitos` em branco,
  * **Quando** solicita a publicação da oportunidade,
  * **Então** a API bloqueia a gravação, retorna `HTTP 400 Bad Request` e a interface exibe o aviso *"Preencha todos os campos obrigatórios antes de publicar."*.

* **Cenário de Falha 2 - Formato de Contato Inválido (BDD):**
  * **Dado** que o anunciante preenche todos os campos, mas informa um texto sem formato de URL, e-mail ou telefone no campo `link_ou_contato`,
  * **Quando** solicita a publicação da oportunidade,
  * **Então** o sistema bloqueia a requisição, retorna `HTTP 400 Bad Request` e exibe o aviso *"Informe um link, e-mail ou WhatsApp válido para a inscrição."*.

---

### 📌 RF-02: Listar e Filtrar Oportunidades

* **Ator:** Candidato / Usuário em busca de vagas ou cursos.
* **Entradas:** Seleção opcional de filtro por **Vertente** (Qualificação Profissional vs Mercado de Trabalho) **OU** por **Tipo de Categoria** (`curso`, `oficina`, `emprego`, `estagio`).

#### Regras de Negócio (Camada Service/Repository):
1. O sistema deve consultar e retornar apenas registros com status `ativa`.
2. A ordenação padrão é cronológica decrescente, utilizando o campo `created_at` gerado automaticamente pelo banco no cadastro.
3. O filtro por **Vertente** agrupa as categorias correspondentes:
   * **Qualificação Profissional** $\rightarrow$ Cursos / Oficinas
   * **Mercado de Trabalho** $\rightarrow$ Empregos / Estágios

#### Saída Observável:
* **API (Back-end):** Retorno de `HTTP 200 OK` com o array JSON dos registros ativos.
* **Interface (Front-end):** Renderização dos cards resumidos em componentes React.

#### Cenários BDD — RF-02:

* **Cenário de Sucesso 1 - Filtro por Vertente (BDD):**
  * **Dado** que o candidato acessa a aplicação e seleciona o filtro "Qualificação Profissional",
  * **Quando** a busca é atualizada,
  * **Então** a API retorna `HTTP 200 OK` e a interface exibe os cards de oportunidades ativas das categorias "curso" ou "oficina", ordenados pelo `created_at` mais recente.

* **Cenário de Sucesso 2 - Filtro por Categoria Específica (BDD):**
  * **Dado** que o candidato seleciona a categoria específica "Estágio",
  * **Quando** a busca é atualizada,
  * **Então** a API retorna `HTTP 200 OK` e a interface exibe apenas os cards da categoria "estágio", ordenados pelo `created_at` mais recente.

* **Cenário de Falha/Rejeição (BDD):**
  * **Dado** que o candidato seleciona um filtro que não possui registros ativos cadastrados no momento,
  * **Quando** a consulta é executada,
  * **Então** a API retorna `HTTP 200 OK` com lista vazia `[]` e a interface exibe a mensagem *"Nenhuma oportunidade encontrada para o filtro selecionado no momento."*.

---

### 📌 RF-03: Visualizar Detalhes e Registrar Evento de Consulta

* **Ator:** Candidato / Usuário.
* **Entradas:** Clique no botão "Ver Detalhes" de um card (envia o `id` da oportunidade via parâmetro URL).

#### Regras de Negócio (Camada Service):
1. A consulta de detalhes recupera o registro pelo `id` e analisa o valor do campo `status`.
2. Se a oportunidade possuir status `ativa`, a camada de Service aciona o Repository para gravar automaticamente uma linha na tabela `visualizacoes_log` registrando o `oportunidade_id` e o timestamp `created_at`.
3. Se a oportunidade possuir status `encerrada`, os dados são retornados para exibição do aviso de finalização na interface, omitindo a inserção de log de visualização.

#### Saída Observável:
* **API (Back-end):** Retorno de `HTTP 200 OK` com o objeto JSON da oportunidade (e gravação na tabela `visualizacoes_log` apenas se o status for `ativa`).
* **Interface (Front-end):**
  * **Status Ativo:** Exibição do modal React com os requisitos completos e botão de inscrição habilitado.
  * **Status Encerrado:** Exibição do modal React com aviso de encerramento e botão de inscrição oculto/desabilitado.

#### Cenários BDD — RF-03:

* **Cenário de Sucesso (Oportunidade Ativa) - BDD:**
  * **Dado** que o candidato clica em "Ver Detalhes" em um card com status "ativa",
  * **Quando** a requisição é processada pela API,
  * **Então** a API insere um registro com timestamp na tabela `visualizacoes_log`, retorna `HTTP 200 OK` e a interface exibe os requisitos completos e o link de inscrição ativo.

* **Cenário de Rejeição/Aviso (Oportunidade Encerrada) - BDD:**
  * **Dado** que o candidato clica em "Ver Detalhes" em uma vaga cujo status atual no banco é "encerrada",
  * **Quando** a requisição é processada pela API,
  * **Então** a API retorna `HTTP 200 OK` sem gravar registro de log e a interface exibe o modal informando que a oportunidade foi encerrada.

---

### 📌 RF-04: Gerenciar Status da Oportunidade

* **Ator:** Anunciante / Representante de Empresa ou Instituição.
* **Entradas:** Identificador (`id`) da oportunidade e ação de alteração de status (`ativa` $\leftrightarrow$ `encerrada`).

#### Regras de Negócio (Camada Service):
1. A alteração para `encerrada` remove imediatamente o registro da listagem pública da vitrine (RF-02).
2. O registro permanece conservado no banco de dados para integridade de relatórios e métricas de uso (**Soft Delete**).
3. A reativação da oportunidade traz o registro de volta para a listagem pública ativa.

#### Saída Observável:
* **API (Back-end):** Retorno de `HTTP 200 OK` confirmando a alteração de status.
* **Banco de Dados (Repository):** Atualização do campo `status` no registro correspondente da tabela `oportunidades`.
* **Interface (Front-end):** Atualização imediata do status no painel do anunciante e remoção/reexibição na vitrine pública.

#### Cenários BDD — RF-04:

* **Cenário de Sucesso - Encerrar Oportunidade (BDD):**
  * **Dado** que o anunciante acessa o painel e solicita o encerramento de uma oportunidade ativa,
  * **Quando** confirma a alteração de status,
  * **Então** a API atualiza o campo `status` para "encerrada" no banco de dados, retorna `HTTP 200 OK` e a vaga deixa de ser exibida na vitrine pública.

* **Cenário de Sucesso - Reativar Oportunidade (BDD):**
  * **Dado** que o anunciante solicita a reativação de uma oportunidade previamente encerrada,
  * **Quando** confirma a alteração de status,
  * **Então** a API atualiza o campo `status` para "ativa" no banco de dados, retorna `HTTP 200 OK` e a vaga volta a ser exibida na vitrine pública.

---

## 🛠 Stack Tecnológica Definitiva

* **Front-end:** React.js, Tailwind CSS e Fetch API/Axios.
* **Back-end:** Python, Django REST Framework com Arquitetura em Camadas (Repository/Service/Controller).
* **Banco de Dados & Persistência em Nuvem:** PostgreSQL hospedado no Supabase.