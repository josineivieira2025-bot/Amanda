import { User } from '../models/User.js';

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    studioName: user.studioName,
    avatarUrl: user.avatarUrl,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

export async function listUsers() {
  return User.find({}).select('-password').sort({ createdAt: -1 });
}

export async function createUser(data) {
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    const error = new Error('Email ja cadastrado.');
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({
    name: data.name,
    studioName: data.studioName || '',
    email: data.email,
    password: data.password,
    role: data.role || 'photographer'
  });

  return publicUser(user);
}

export async function deleteUser(id) {
  return User.findByIdAndDelete(id);
}
