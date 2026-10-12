# 🚀 ConectaOportunidades

> **Centralizando oportunidades de qualificações e vagas locais em uma plataforma acessível.**

---

## 📌 1. A Dor Real e o Problema

Na comunidade local e nas instituições de ensino (como o IFPI), estudantes e cidadãos enfrentam dificuldades para encontrar oportunidades em um só lugar. Editais de oficinas, cursos gratuitos,vagas de estágio e empregos ficam pulverizados em murais físicos, grupos de mensagens e postagens em redes sociais.

Essa falta de centralização gera duas grandes dores:
1. **Para os Candidatos:** Perda de prazos, dificuldade de acesso à informação e falta de clareza nos requisitos para inscrição.
2. **Para as Instituições/Empresas:** Baixo alcance nas divulgações, dificuldade em mensurar a procura e preenchimento incompleto das vagas ofertadas.

---

## 💡 2. A Solução (Pitch de 1 Frase)

O **conectaOportunidades** é uma plataforma web que centraliza e categoriza oportunidades de qualificação profissional e mercado de trabalho, conectando a comunidade a editais, cursos e vagas de forma simples e transparente.

---

## 🎯 3. Requisitos Funcionais do MVP (Versão 1.0)

* **RF-01: Cadastrar Oportunidade:** Permite a publicação de novas oportunidades (cursos, oficinas, empregos e estágios) com validação de campos obrigatórios e formatos de contato.
* **RF-02: Listar e Filtrar Oportunidades:** Exibe a vitrine de vagas ativas com ordenação cronológica e filtros por vertente (*Qualificação Profissional* vs *Mercado de Trabalho*) ou categoria específica.
* **RF-03: Visualizar Detalhes e Registrar Consulta:** Apresenta as informações detalhadas em modal interativo e contabiliza eventos de visualização em tabela separada de logs apenas para oportunidades ativas.
* **RF-04: Gerenciar Status da Oportunidade:** Permite alternar o status do registro (`ativa` $\leftrightarrow$ `encerrada`), garantindo a inativação lógica (*Soft Delete*) e a manutenção do histórico no banco de dados.

---

## 🚫 4. Lista Proibida (Fora do Escopo do MVP 1)

Para garantir o rigor técnico e a entrega focada nas Aulas 08 e 09, as seguintes funcionalidades estão **estritamente proibidas** nesta versão inicial:

* ❌ Módulo de autenticação complexa, criação de perfis de usuários e telas de login/cadastro (diferidos para a Aula 10 via `Supabase Auth`).
* ❌ Upload direto de arquivos (curriculums em PDF ou imagens anexas).
* ❌ Sistema de inscrições nativo na plataforma (o redirecionamento ocorre via link/contato do anunciante).
* ❌ Edição completa de todos os campos de uma oportunidade já cadastrada.

---

## 🏗 5. Arquitetura de Software e Tecnologias

A aplicação adota um modelo **Full-stack Decoupled (API-First)**:

* **Front-end:** Interface web reativa construída em React.js + Tailwind CSS, focada em componentes modernos, usabilidade e consumo assíncrono dos endpoints da API RESTful.
* **Back-end:** **Python com Django REST Framework**, estruturado em **Arquitetura em Camadas**:
  * `Controllers / Views`: Tratamento do protocolo HTTP e retornos JSON.
  * `Services`: Concentração e isolamento das regras de negócio.
  * `Repositories`: Abstração de persistência usando a ORM do Django.
* **Banco de Dados**: PostgreSQL hospedado na nuvem via Supabase.

