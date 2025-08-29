import express from 'express';
import healthRouter from './routes/health';

const app = express();

app.use(express.json());
app.use('/health', healthRouter);

app.get('/', (_req, res) => {
  res.json({ service: 'auth-service', status: 'ok' });
});

export default app;
