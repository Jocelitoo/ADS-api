API DS Catalog

⚙️ Funcionalidades
Criação de usuários ([POST] /users)
Listagem de todos os usuários ([GET] /users)
Listar um usuário específico ([GET] /users/:id)
Atualização de usuários ([PUT] /users)
Remoção de usuários ([DELETE] /users)
Criação de pedidos ([POST] /orders)
Listagem de pedidos([GET] /orders)
Autenticação de usuários via JWT ([POST] /tokens)

🛠 Tecnologias
Ferramentas usadas na construção do backend:

Node.js (v20.10.0)
Express
MongoDB Atlas
Prisma

🚀 Como executar o projeto

Clone o projeto e depois de baixado entre na raiz do projeto e execute:
npm install

Crie um arquivo .env na raiz do projeto e escreva as variáveis abaixo:


DATABASE_URL='Sua url de conexão com o MongoDB'
TOKEN_SECRET = 'sua chave secreta'
TOKEN_EXPIRATION = Tempo de duração do JWT (exemplo: '3d') 

execute o comando na raiz:
npm run dev

Verifique se o backend vai iniciar.
