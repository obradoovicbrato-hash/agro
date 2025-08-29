import express from 'express';
import healthRouter from './routes/health';
import authRouter from './routes/auth';

const app = express();

app.use(express.json());
app.use('/health', healthRouter);
app.use('/api/v1/auth', authRouter);

app.get('/', (_req, res) => {
  res.json({ service: 'auth-service', status: 'ok' });
});

export default app;
