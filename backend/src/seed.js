import 'dotenv/config';
import { connectDatabase } from './config/db.js';
import { User } from './models/User.js';

const email = process.env.ADMIN_EMAIL || process.argv[2] || 'admin@agendaamanda.local';
const password = process.env.ADMIN_PASSWORD || process.argv[3] || 'Admin@2026';
const name = process.env.ADMIN_NAME || process.argv[4] || 'Administrador';

async function createAdmin() {
  await connectDatabase();

  const adminExists = await User.exists({ role: 'admin' });
  if (adminExists) {
    console.log('Já existe um usuário admin no banco. Nada foi alterado.');
    process.exit(0);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    if (existingUser.role !== 'admin') {
      existingUser.role = 'admin';
      existingUser.name = name;
      existingUser.password = password;
      await existingUser.save();
      console.log(`Usuário existente atualizado para admin: ${email}`);
      process.exit(0);
    }

    console.log(`O usuário ${email} já existe como admin.`);
    process.exit(0);
  }

  await User.create({ name, email, password, role: 'admin' });
  console.log(`Admin criado com sucesso: ${email}`);
  console.log('Senha:', password);
  process.exit(0);
}

createAdmin().catch((error) => {
  console.error('Erro ao criar admin:', error.message);
  process.exit(1);
});
