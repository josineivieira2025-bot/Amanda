import { User } from '../models/User.js';
import { signToken } from '../utils/token.js';

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    studioName: user.studioName,
    avatarUrl: user.avatarUrl,
    role: user.role
  };
}

export async function registerUser(data) {
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    const error = new Error('Email ja cadastrado.');
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create(data);
  return { user: publicUser(user), token: signToken(user._id) };
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    const error = new Error('Credenciais invalidas.');
    error.statusCode = 401;
    throw error;
  }

  return { user: publicUser(user), token: signToken(user._id) };
}

export async function updateUserProfile(userId, data) {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('Usuario nao encontrado.');
    error.statusCode = 404;
    throw error;
  }

  user.name = data.name ?? user.name;
  user.studioName = data.studioName ?? user.studioName;
  user.avatarUrl = data.avatarUrl ?? user.avatarUrl;
  await user.save();

  return publicUser(user);
}

export async function updateUserPassword(userId, currentPassword, newPassword) {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('Usuario nao encontrado.');
    error.statusCode = 404;
    throw error;
  }

  if (!(await user.matchPassword(currentPassword))) {
    const error = new Error('Senha atual incorreta.');
    error.statusCode = 400;
    throw error;
  }

  user.password = newPassword;
  await user.save();

  return { message: 'Senha atualizada com sucesso.' };
}
