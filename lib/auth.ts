import bcrypt from 'bcryptjs';

export async function hashPassword(password: string) {
  const hashed = await bcrypt.hash(password, 10);
  return hashed;
}

export async function verifyPassword(password: string, hashedPassword: string) {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}
