import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

type User = {
  id: string;
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
};

const users = new Map<string, User>();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

router.post('/register', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password required' });
  }
  if (Array.from(users.values()).some((u) => u.email === email)) {
    return res.status(409).json({ error: 'user already exists' });
  }
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const id = `user_${users.size + 1}`;
  const user: User = { id, email, passwordHash, firstName, lastName };
  users.set(id, user);
  const token = jwt.sign({ sub: id, email }, JWT_SECRET, { expiresIn: '15m' });
  return res.status(201).json({ token });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const user = Array.from(users.values()).find((u) => u.email === email);
  if (!user) return res.status(401).json({ error: 'invalid credentials' });
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ error: 'invalid credentials' });
  const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '15m' });
  return res.json({ token });
});

export default router;
