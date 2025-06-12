import { Router } from 'express';

const router = Router();

// Example route (replace with real payment logic as needed)
router.get('/test', (_req, res) => {
  res.json({ message: 'Payment route is working' });
});

export default router; 