/* Delivery partner dashboard page */

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';

const DELIVERY_ID = 'dp1'; // Sohith mock delivery partner

const DeliveryOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [tracking, setTracking] = useState<Record<string, boolean>>({});
  const socketRef = useRef<Socket | null>(null);
  const intervalRef = useRef<Record<string, NodeJS.Timeout>>({});

  useEffect(() => {
    axios.get('http://localhost:5050/api/orders').then(res => {
      setOrders(res.data.filter((o: any) => o.deliveryPartnerId === DELIVERY_ID));
    });
    socketRef.current = io('http://localhost:5050');
    return () => {
      Object.values(intervalRef.current).forEach(clearInterval);
      socketRef.current?.disconnect();
    };
  }, []);

  const startDelivery = (order: any) => {
    setTracking(t => ({ ...t, [order._id]: true }));
    let lat = order.location.lat;
    let lng = order.location.lng;
    intervalRef.current[order._id] = setInterval(() => {
      lat += 0.0001;
      lng += 0.0001;
      socketRef.current?.emit('startTracking', { orderId: order._id, lat, lng });
    }, 3000);
  };

  return (
    <div style={{ padding: 32 }}>
      <h1>Delivery Partner Orders (Sohith Generated)</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.customerName}</td>
              <td>{order.status}</td>
              <td>
                <button onClick={() => startDelivery(order)} disabled={tracking[order._id]}>
                  {tracking[order._id] ? 'Tracking...' : 'Start Delivery'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveryOrders;