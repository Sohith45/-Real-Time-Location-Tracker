import express from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = 'AI_GENERATED_SECRET';

// Signup
router.post('/signup', async (req: any, res: any) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(400).json({ error: 'Signup failed' });
  }
});

// Login
router.post('/login', async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(400).json({ error: 'Login failed' });
  }
});

export default router;