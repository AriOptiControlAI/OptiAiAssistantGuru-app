import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'opticontrol-dev-secret-32chars!!'
);

export const DEMO_USERS = [
  { id: 'user-001', email: 'demo@opticontrol.ai', password: 'demo1234', name: 'Alex' },
  { id: 'user-002', email: 'admin@opticontrol.ai', password: 'admin1234', name: 'Admin' },
];

export async function signToken(payload: {
  userId: string;
  email: string;
  name: string;
}): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifyToken(
  token: string
): Promise<{ userId: string; email: string; name: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { userId: string; email: string; name: string };
  } catch {
    return null;
  }
}
