import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { SITE_URL } from '../../shared/site.constants.js';

const allowedOrigins = [
  SITE_URL,
  'http://localhost:5173',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
];

export function setupSecurity(app) {
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }));

  app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Juda ko\'p so\'rov. Biroz kutib qayta urinib ko\'ring.' },
  }));

  const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: { error: 'Soatiga 5 ta xabar yuborish mumkin.' },
  });

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: 'Juda ko\'p urinish. 15 daqiqadan keyin qayta urinib ko\'ring.' },
  });

  return { contactLimiter, authLimiter };
}

export function corsOptions() {
  return {
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS ruxsat etilmagan'));
      }
    },
    credentials: true,
  };
}

export function sanitizeString(str, maxLen = 500) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLen);
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
