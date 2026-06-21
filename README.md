# Sistema de Controle de Estoque

App web completo com banco de dados, gráficos e sincronização em tempo real.

---

## Rodar localmente (para testar)

1. Instale o Node.js em https://nodejs.org (versão 18 ou superior)
2. Abra o terminal na pasta do projeto
3. Execute:
   ```
   npm install
   npm start
   ```
4. Acesse http://localhost:3000 no Chrome

---

## Hospedar no Render (grátis, acesso de qualquer lugar)

1. Crie uma conta em https://render.com
2. Clique em "New" → "Web Service"
3. Conecte ao GitHub (faça upload do projeto)
4. Configure:
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Environment: Node
5. Clique em "Deploy"
6. Aguarde — em 2 minutos seu app estará em um endereço fixo tipo:
   `https://estoque-suaempresa.onrender.com`
7. Compartilhe esse link com todos os computadores e celulares da empresa

---

## Como fazer upload para o GitHub

1. Acesse https://github.com e crie uma conta gratuita
2. Crie um repositório novo chamado "estoque-app"
3. Faça upload de todos os arquivos desta pasta
4. No Render, conecte ao repositório criado

---

## Arquivos do projeto

- `server.js` — servidor Node.js com banco de dados SQLite
- `package.json` — dependências do projeto
- `public/index.html` — interface do usuário
- `estoque.db` — banco de dados (criado automaticamente ao rodar)

---

## Funcionalidades

- Estoque com 122 produtos pré-cadastrados
- Entradas e saídas com registro de vendedor
- Alertas de estoque mínimo
- Gráficos: movimentações, status, top vendedores, produtos mais movimentados
- Histórico completo
- Sincronização em tempo real (atualiza a cada 15 segundos)
- Acesso simultâneo de vários computadores/celulares
