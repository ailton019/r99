📘 R99 – Base Operacional ERP N1

Após diversas alterações e melhorias no projeto, defini o seguinte padrão de versionamento:

V4.0.0 – Base
Refere-se à versão estrutural do sistema, incluindo layout, funcionalidades e arquitetura principal.


C.0.03 – Conteúdo
Refere-se exclusivamente ao conteúdo cadastrado na base.
O número final (03) representa a quantidade total de conteúdos atualmente registrados na base.



Sistema web simples desenvolvido para centralizar e organizar rotinas operacionais de ERP, facilitando consultas rápidas para suporte N1.

🎯 Objetivo

Criar uma base de conhecimento leve, pesquisável e organizada, contendo:

Nome da rotina

Módulo

Caminho completo no sistema

Permissões necessárias

Checklist de validação N1

Orientação de escalonamento

O projeto serve como apoio para analistas de suporte, reduzindo tempo de atendimento e padronizando análises.

🖥️ Tecnologias Utilizadas

HTML5

CSS3

JavaScript

JSON (base de dados local)

Não utiliza framework — projeto 100% leve e local.

📂 Estrutura do Projeto
R99/
│
├── index.html        # Página principal
├── dados.json        # Base de dados das rotinas
├── css/
│   └── style.css     # Estilização
├── js/
│   └── script.js     # Lógica de busca
└── README.md

🔎 Funcionalidades

🔍 Campo de busca por palavra-chave

📄 Exibição estruturada da rotina

📋 Checklist padrão para N1

🛑 Orientação de quando escalar

⚡ Resposta rápida sem backend

🧠 Como Funciona

O usuário digita um termo no campo de busca.

O JavaScript consulta o arquivo dados.json.

Se encontrar correspondência:

Exibe a rotina formatada em tela.

Caso não encontre:

Informa que não há resultado.

➕ Como Adicionar Novas Rotinas

Adicionar um novo objeto dentro do dados.json seguindo o padrão:

{
  "nome": "Nome da Rotina",
  "modulo": "Nome do Módulo",
  "caminho": "ERP > Módulo > Menu > Submenu",
  "permissoes": [
    "Permissão 1",
    "Permissão 2"
  ],
  "checklist": [
    "Validar passo 1",
    "Validar passo 2"
  ],
  "escalonamento": "Quando escalar para N2"
}

🚀 Próximas Evoluções (Roadmap)

 Filtro por módulo

 Organização por categorias

 Integração com GitHub Issues para colaboração

 Campo de sugestão de melhoria

 Versão online hospedada

 Controle de versão das rotinas

📌 Público-Alvo

Analistas N1

Suporte técnico ERP

Times operacionais

Base interna de conhecimento
