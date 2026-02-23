# 📘 R99 – Base Operacional ERP N1

Sistema web leve desenvolvido para centralizar, organizar e padronizar rotinas operacionais de ERP, com foco em suporte N1.

---

## 🔖 Versionamento

O projeto utiliza dois níveis de versionamento:

### 🔹 V4.0.0 – Base
Refere-se à versão estrutural do sistema:
- Layout
- Arquitetura
- Organização de código
- Funcionalidades principais

### 🔹 C.0.03 – Conteúdo
Refere-se exclusivamente à quantidade de rotinas cadastradas na base.  
O número final representa o total atual de conteúdos registrados.

---

## 🎯 Objetivo

Criar uma base de conhecimento:

- Leve
- Rápida
- Pesquisável
- Padronizada

Com o propósito de:

- Reduzir tempo de atendimento
- Padronizar análises
- Aumentar assertividade no suporte N1
- Centralizar conhecimento operacional

---

## 📌 Estrutura das Rotinas

Cada rotina cadastrada contém:

- Nome da rotina
- Módulo
- Caminho completo no sistema
- Permissões necessárias
- Checklist de validação N1
- Orientação de escalonamento

---

## 🖥️ Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript
- JSON (base de dados local)

> Projeto 100% leve, sem utilização de frameworks e sem backend.

---

## 📂 Estrutura do Projeto

---

## 🔎 Funcionalidades

- 🔍 Busca por palavra-chave
- 📄 Exibição estruturada da rotina
- 📋 Checklist padrão para N1
- 🛑 Diretriz clara de escalonamento
- ⚡ Resposta imediata (sem backend)

---

## 🧠 Como Funciona

1. O usuário digita um termo no campo de busca.
2. O JavaScript consulta o arquivo `dados.json`.
3. Se houver correspondência:
   - A rotina é exibida formatada na tela.
4. Caso não exista resultado:
   - O sistema informa que não há registros compatíveis.

---

## ➕ Como Adicionar Novas Rotinas

Adicionar um novo objeto dentro do `dados.json`, seguindo o padrão:

```json
{
  "id": 2,
  "nome": "Fechamento de Caixa",
  "modulo": "Faturamento",
  "palavrasChave": [
    "fechamento de caixa",
    "fechamento",
    "caixa"
  ],
  "descricao": "Fechamento de Caixa",
  "caminho": "ERP > Faturamento > Venda Fácil > Fechamento de Caixa",
  "status": "Ativo",
  "checklist": [
    "Conferir valores faturados no movimento diário",
    "Validar se o usuário que está fechando é o mesmo que abriu",
    "Validar se os valores informados correspondem ao faturado",
    "Verificar filtros aplicados (ex: desconsiderar vale-trocas)",
    "Confirmar sincronização das vendas do POS com ERP"
  ],
  "manual": {
    "titulo": "Manual - Fechamento de Caixa",
    "url": "https://share.linx.com.br/display/SHOPLINXMICRPUB/Fechamento+de+Caixa+-+Painel"
  }
  },