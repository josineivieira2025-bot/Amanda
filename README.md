# Photo ERP

Sistema ERP completo para fotografos: agenda, clientes, eventos, galeria, area do cliente, financeiro e dashboard.

## Tecnologias

- Frontend: React + Vite
- Backend: Node.js + Express
- Banco: MongoDB com Mongoose
- Autenticacao: JWT
- Upload de imagens: simulado por URLs cloud

## Como rodar

1. Instale dependencias:

```bash
npm run install:all
```

2. Configure o backend:

```bash
cp backend/.env.example backend/.env
```

Edite `backend/.env` se necessario. Por padrao ele usa `mongodb://127.0.0.1:27017/photo_erp`.

3. Rode o MongoDB localmente ou use uma URL do MongoDB Atlas em `MONGO_URI`.

4. Inicie frontend e backend:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:4000/api

## Fluxo principal

1. Cadastre um fotografo em `/register`.
2. Crie clientes.
3. Crie eventos vinculados aos clientes.
4. Adicione fotos simulando URLs cloud.
5. Compartilhe o link unico do evento para o cliente.
6. Registre pagamentos e acompanhe indicadores no dashboard.
