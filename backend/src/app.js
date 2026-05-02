import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import catalogRoutes from './routes/catalogRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import photoRoutes from './routes/photoRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

function parseAllowedOrigins() {
  return [
    process.env.CLIENT_URL,
    process.env.PUBLIC_SITE_URL,
    process.env.ALLOWED_ORIGINS
  ]
    .filter(Boolean)
    .flatMap((value) => value.split(','))
    .map((value) => value.trim())
    .filter(Boolean);
}

const allowedOrigins = parseAllowedOrigins();

app.use(cors((req, callback) => {
  const origin = req.header('Origin');
  const isPublicRoute = req.path.startsWith('/api/public');

  if (isPublicRoute) {
    callback(null, { origin: true, credentials: true });
    return;
  }

  if (!origin || !allowedOrigins.length || allowedOrigins.includes(origin)) {
    callback(null, { origin: true, credentials: true });
    return;
  }

  callback(new Error('Origem nao permitida pelo CORS.'));
}));
app.use(express.json({ limit: '15mb' }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'photo-erp-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/public', publicRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
