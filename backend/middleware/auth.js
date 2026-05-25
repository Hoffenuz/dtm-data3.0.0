import { verifyToken } from '../supabase.js';

export async function optionalAuth(req, _res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (token) {
    req.user = await verifyToken(token);
    req.accessToken = token;
  }
  next();
}

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'Tizimga kirishingiz kerak' });
  }
  const user = await verifyToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Sessiya muddati tugagan. Qayta kiring.' });
  }
  req.user = user;
  req.accessToken = token;
  next();
}
