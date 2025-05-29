/* Order routes for getting, creating, and assigning orders */

import express from 'express';
import Order from '../models/Order';

const router = express.Router();

// GET all orders
router.get('/', async (req: any, res: any) => {
  const orders = await Order.find();
  res.json(orders);
});

// POST new order
router.post('/', async (req: any, res: any) => {
  const { vendorId, customerName, location } = req.body;
  const order = new Order({
    vendorId,
    customerName,
    status: 'pending',
    location
  });
  await order.save();
  res.status(201).json(order);
});

// POST assign delivery partner
router.post('/:orderId/assign', async (req: any, res: any) => {
  const { orderId } = req.params;
  const { deliveryPartnerId } = req.body;
  const order = await Order.findByIdAndUpdate(orderId, { deliveryPartnerId, status: 'assigned' }, { new: true });
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// POST create sample order
router.post('/sample', async (req: any, res: any) => {
  try {
    const sampleOrder = new Order({
      vendorId: 'vendor123',
      customerName: 'John Doe',
      status: 'pending',
      location: {
        lat: 12.9716,
        lng: 77.5946
      }
    });
    await sampleOrder.save();
    res.status(201).json(sampleOrder);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create sample order' });
  }
});

export default router;