import express from 'express';
import Order from '../models/Order';

const router = express.Router();

// POST update delivery location
router.post('/:orderId', async (req: any, res: any) => {
  const { orderId } = req.params;
  const { lat, lng } = req.body;
  const order = await Order.findByIdAndUpdate(orderId, { location: { lat, lng } }, { new: true });
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// GET current location
router.get('/:orderId', async (req: any, res: any) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order.location);
});

export default router;